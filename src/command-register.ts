import { CLICommand, getCommands } from "./commands";
import { setUser } from "./config";
import { createUser, getUserFromName } from "./lib/db/queries/users";

async function commandHelp(cmdName: string, ...args: string[]) {
    if(args.length <= 0) {
        throw new Error("Login requires one parameter: Login name");
    }

    const username = args[0];

    // First check if a user with this name exists, error if so
    const userResult = await getUserFromName(username);
    if(userResult != null) {
        throw new Error(`User with name ${username} already exists.`);
    }

    await createUser(username);
    setUser(username);

    console.log(`Created and logged into user: ${username}`);
}

export const RegisterCommand : CLICommand = {
    name: "register",
    description: "Register a new user in the database",
    callback: commandHelp,
};