import { CLICommand } from "./commands";
import { resetUsers } from "./lib/db/queries/users";

async function commandReset(cmdName: string, ...args: string[]) {
    
    await resetUsers();
    console.log(`Ran ResetUsers`);
}

export const ResetCommand : CLICommand = {
    name: "reset",
    description: "Deletes all users",
    callback: commandReset,
};