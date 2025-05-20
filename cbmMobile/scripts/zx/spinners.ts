enum SpinnerStatus {
  NotStarted,
  Running,
  Done,
}

interface Spinner<T> {
  result: Promise<T>;
  status: SpinnerStatus;
  text: string;
}

let spinners: Array<Spinner<unknown>> = [];
let i = 0;
let updateInterval: ReturnType<typeof setInterval> | null = null;

export const spinner = <T>(text: string, runner: () => Promise<T>): Promise<T> => {
  if (updateInterval == null) {
    updateInterval = setInterval(() => {
      updateSpinners();
    }, 100);
  }

  const result = runner();

  const currentSpinner: Spinner<T> = {
    text,
    status: SpinnerStatus.NotStarted,
    result,
  };

  spinners.push(currentSpinner);

  return result;
};

const updateSpinners = () => {
  // If there are no active spinners, do nothing.
  if (spinners.length === 0) {
    // Clear interval if needed.
    if (updateInterval != null) {
      clearInterval(updateInterval);
      updateInterval = null;
    }

    return;
  }

  const prefix = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'[i];
  i = (i + 1) % 10;

  // Get all currently active spinners.
  const runningSpinners = spinners.filter((spinner) => spinner.status !== SpinnerStatus.Done);

  let output = '';

  // Print all currently running spinners.
  runningSpinners.forEach((spinner) => {
    output += `${prefix} ${spinner.text}\n`;

    // If spinner hasn't been started, call its runner on the next tick.
    if (spinner.status === SpinnerStatus.NotStarted) {
      process.nextTick(() => {
        spinner.result
          .catch(() => {
            // nothing here, error will be exposed to caller
          })
          .finally(() => {
            // Mark spinner as done when runner resolves.
            spinner.status = SpinnerStatus.Done;
          });
      });

      // Mark spinner as running.
      spinner.status = SpinnerStatus.Running;
    }
  });

  // Clear the lines that were previously used by spinners that are now done.
  // Since we've already written `runningSpinners.length` lines, we need to
  // subtract that from the total amount of spinners.
  // After this, our cursor will be at the last line that was previously used.
  output += '\u001b[2K\r\n'.repeat(spinners.length - runningSpinners.length);

  // Move the cursor before the first spinner.
  output += `\u001b[${spinners.length}A`;

  process.stdout.write(output);

  // Remove done spinners
  spinners = runningSpinners;
};
