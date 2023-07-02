import { waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";

import { CACHE_TTL, DEDUPE_TTL, SWRCacheEntry, swr } from "./cache";

const NOW = 1609459200000;

describe("cache", () => {
  const loader: Mock<[], Promise<string>> = vi.fn(() =>
    Promise.resolve("new_test_value")
  );
  let callback = vi.fn();

  let cacheEntry: SWRCacheEntry<string> | null = null;

  beforeEach(() => {
    vi.setSystemTime(new Date("2021-01-01T00:00:00.000Z"));
    vi.clearAllMocks();

    // Reset callbacks (since they get loaded into a listener map)
    callback = vi.fn();

    cacheEntry = null;

    localStorage.clear();
  });

  function subject() {
    if (cacheEntry) {
      localStorage.setItem("test", JSON.stringify(cacheEntry));
    }
    swr("test", loader, callback);
  }

  describe("default behavior", () => {
    it("should set loading and call loader when cache does not exist", () => {
      subject();

      expect(loader).toHaveBeenCalled();

      expect(callback).toHaveBeenCalledWith({ loading: true });
      expect(callback).toHaveBeenCalledTimes(1);

      expect(localStorage.getItem("test")).toEqual(
        JSON.stringify({ loadingStart: NOW })
      );
    });

    it("should NOT call loader and NOT reset loadingStart when key is already being loaded", () => {
      cacheEntry = { loadingStart: NOW - 5 };

      subject();

      expect(loader).not.toHaveBeenCalled();

      expect(callback).toHaveBeenCalledWith({ loading: true });
      expect(callback).toHaveBeenCalledTimes(1);

      expect(localStorage.getItem("test")).toEqual(
        JSON.stringify({ loadingStart: NOW - 5 })
      );
    });

    it("should call loader and reset loadingStart when loadingStart is invalid", () => {
      cacheEntry = { loadingStart: NOW - DEDUPE_TTL - 5 };

      subject();

      expect(loader).toHaveBeenCalled();

      expect(callback).toHaveBeenCalledWith({
        loading: true,
        value: undefined,
      });
      expect(callback).toHaveBeenCalledTimes(1);

      expect(localStorage.getItem("test")).toEqual(
        JSON.stringify({ loadingStart: 1609459200000 })
      );
    });
  });

  describe("when cache exists", () => {
    it("should return the cached value, then revalidate if cache is stale", async () => {
      cacheEntry = { lastFetched: NOW - CACHE_TTL - 5, value: "test_value" };
      subject();

      await waitFor(() => expect(callback).toHaveBeenCalledTimes(2));

      expect(loader).toHaveBeenCalledTimes(1);

      expect(callback).toHaveBeenCalledWith({
        loading: false,
        value: "test_value",
      });
      expect(callback).toHaveBeenCalledWith({
        loading: false,
        value: "new_test_value",
      });

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "test",
        JSON.stringify({ loadingStart: NOW, value: "test_value" })
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "test",
        JSON.stringify({ lastFetched: NOW, value: "new_test_value" })
      );

      expect(localStorage.getItem("test")).toEqual(
        JSON.stringify({ lastFetched: NOW, value: "new_test_value" })
      );
    });

    it("should return the cached value, but NOT revalidate if fetched recently", () => {
      cacheEntry = { lastFetched: NOW - 5, value: "test_value" };

      subject();

      expect(loader).not.toHaveBeenCalled();

      expect(callback).toHaveBeenCalledWith({
        loading: false,
        value: "test_value",
      });
      expect(callback).toHaveBeenCalledTimes(1);

      expect(localStorage.getItem("test")).toEqual(
        JSON.stringify({ lastFetched: NOW - 5, value: "test_value" })
      );
    });
  });

  describe("when multiple calls happen", () => {
    it("should dedupe the loader", async () => {
      cacheEntry = null;

      subject();

      const callback2 = vi.fn();
      swr("test", loader, callback2);

      await waitFor(() => expect(loader).toHaveBeenCalledTimes(1));

      expect(callback).toHaveBeenCalledWith({ loading: true });
      expect(callback).toHaveBeenCalledWith({
        loading: false,
        value: "new_test_value",
      });
      expect(callback).toHaveBeenCalledTimes(2);

      expect(callback2).toHaveBeenCalledWith({ loading: true });
      expect(callback2).toHaveBeenCalledWith({
        loading: false,
        value: "new_test_value",
      });
      expect(callback2).toHaveBeenCalledTimes(2);

      expect(loader).toHaveBeenCalledTimes(1);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "test",
        JSON.stringify({ loadingStart: NOW })
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "test",
        JSON.stringify({ lastFetched: NOW, value: "new_test_value" })
      );
      expect(localStorage.getItem("test")).toEqual(
        JSON.stringify({ lastFetched: NOW, value: "new_test_value" })
      );
    });
  });
});
