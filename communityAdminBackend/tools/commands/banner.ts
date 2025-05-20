import * as chalk from 'chalk';
import * as figlet from 'figlet';

(<any>figlet)(process.argv[2], (error: any, data: any) => {
    if (error) {
        console.error(error);
        return process.exit(1);
    }

    // tslint:disable:no-console
    console.log(chalk.blue(data));
    console.log('');
    return process.exit(0);
});
