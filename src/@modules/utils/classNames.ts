export default function classNames(
  ...classes: (string | number | undefined | null | false)[]
) {
  return classes.filter((s): s is string => !!s).join(" ");
}
