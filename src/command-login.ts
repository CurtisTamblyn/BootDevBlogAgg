import { setUser } from "./config";
import { CLICommand } from "./commands";
import { getUserFromName } from "./lib/db/queries/users";

async function commandLogin(cmdName: string, ...args: string[]) {
    if(args.length <= 0) {
        throw new Error("Login requires one parameter: Login name");
    }

    const username = args[0];

    // Make sure the requested user exists
    const userResult = await getUserFromName(username);
    if(!userResult) {
        throw new Error(`User does not exist: ${username}`);
    }

    setUser(username);

    console.log(`Logged in user is now: ${username}`);
}

export const LoginCommand : CLICommand = {
    name: "login",
    description: "Set the current loggedin user",
    callback: commandLogin,
};