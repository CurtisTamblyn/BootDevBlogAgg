import { setUser } from "./config";
import { CLICommand } from "./commands";

function commandLogin(cmdName: string, ...args: string[]) {
    if(args.length <= 0) {
        throw new Error("Login requires one parameter: Login name");
    }

    const username = args[0];

    setUser(username);

    console.log(`Logged in user is now: ${username}`);
}

export const LoginCommand : CLICommand = {
    name: "login",
    description: "Set the current loggedin user",
    callback: commandLogin,
};