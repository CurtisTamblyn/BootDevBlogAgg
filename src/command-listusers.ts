import { readConfig } from "./config";
import { CLICommand } from "./commands";
import { getAllUsers } from "./lib/db/queries/users";

async function commandListUsers(cmdName: string, ...args: string[]) {

    const users = await getAllUsers();
    const loggedInUser = readConfig().currentUserName;

    if(users.length <= 0) {
        console.log("No users found.");
        return;
    }

    for(const user of users) {
        let nameFormat = `* ${user.name}`;
        if(user.name == loggedInUser) {
            nameFormat += " (current)";
        }
        console.log(nameFormat);
    }
}

export const ListUsersCommand : CLICommand = {
    name: "users",
    description: "List all users in the database",
    callback: commandListUsers,
};