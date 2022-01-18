import { FunctionComponent, MouseEvent, ReactElement } from "react";

export type ToggleProps = {
  value: boolean;
  title: string;
  onToggle: (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    value: boolean
  ) => void;
};

/**
 * Component for a toggle switch.
 *
 * @returns {ReactElement} - Toggle button markup.
 */
const Toggle: FunctionComponent<ToggleProps> = ({ value, title, onToggle }) => {
  return (
    <button
      className="flex items-center px-0.5 border-2 border-neutral-300 dark:border-neutral-50 rounded-full w-10 h-6"
      role="switch"
      aria-checked="false"
      title={title}
      onClick={(event) => {
        onToggle(event, !value);
      }}
    >
      <div
        className={
          (value ? "translate-x-full" : "") +
          " absolute transition rounded-full bg-neutral-300 dark:bg-neutral-50 w-4 h-4"
        }
      ></div>
    </button>
  );
};

export default Toggle;
