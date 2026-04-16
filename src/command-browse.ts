import { getLoggedInUserHandler } from "./command-decorators";
import { CLICommand } from "./commands";
import { getPostsForUser } from "./lib/db/queries/posts";
import { User } from "./lib/db/schema";

async function commandFollow(cmdName: string, user: User, ...args: string[]) {

    const limit  = args[0] ? Number.parseInt(args[0]) : 2;
    const offset = args[1] ? Number.parseInt(args[1]) : 0;

    const posts = await getPostsForUser(user, limit, offset);

    console.log(`Getting Posts ${offset+1}-${offset+limit} (found: ${posts.length})`);
    for(let i = 0; i < posts.length; i++) {
        const post = posts[i];
        const index = i + offset + 1;

        console.log(`Post #${index}`);
        console.log(`** ${post.title} **`);
        console.log(`Date: ${post.publishedAt ?? "Unknown"}`);
        console.log(`Link: ${post.url}`);
        console.log(`Descripton: ${post.description}`);
        console.log("");
    }

};

export const BrowseCommand : CLICommand = {
    name: "browse",
    description: "View saved posts",
    callback: getLoggedInUserHandler(commandFollow),
};