import { Executor } from "@atomist/rug/operations/Executor"
import { Services } from "@atomist/rug/model/Core"
import { Result, Status, Parameter } from "@atomist/rug/operations/RugOperation"

import { TravisService } from "@atomist/travis/core/Core"

interface Parameters {
    build_id: number
    org: string
    build_no: string
    owner: string
    repo: string
    token: string
}

var restartBuild: Executor = {
    description: "Restart a build on Travis CI",
    name: "RestartBuild",
    tags: ["atomist/intent=restart build"],
    parameters: [
        // TODO proper patterns and validation
        { name: "build_id", description: "Build Number", pattern: "^.*$", maxLength: 100, required: true },
        { name: "build_no", description: "Build No", pattern: "^.*$", maxLength: 100, required: false },
        { name: "org", description: "Travis org", pattern: "^(.org|.com)$", maxLength: 100, required: false, default:".org" },
        { name: "owner", description: "GitHub Owner", pattern: "^.*$", maxLength: 100, required: true, displayable: false, tags: ["atomist/owner"] },
        { name: "repo", description: "GitHub Repo", pattern: "^.*$", maxLength: 100, required: true, displayable: false, tags: ["atomist/repository"] },
        // TODO marking it required: false will prevent the bot to ask for it
        { name: "token", description: "GitHub Token", pattern: "^.*$", maxLength: 100, required: false, displayable: false, tags: ["atomist/github/user_token"] }
    ],
    execute(services: Services, p: Parameters): Result {
        console.log(p)
        let _services: any = services
        let travisService = _services.travis() as TravisService
        let status = travisService.restartBuild(p.build_id, p.org, p.token)
        let build_name = "`#" + p.build_no + "`"

        if (status.success()) {
            let repo_slug = "`" + p.owner + "/" + p.repo + "`"
            _services.messageBuilder().say(`Successfully restarted Travis CI build ${build_name} of repo ${repo_slug}`).send()
            return new Result(Status.Success, "OK")
        }
        else {
            _services.messageBuilder().say(status.message()).send()
            return new Result(Status.Error, status.message())
        }
    }
}
