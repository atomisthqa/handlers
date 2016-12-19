import {Atomist} from '@atomist/rug/operations/Handler'
import {TreeNode} from '@atomist/rug/tree/PathExpression'
declare var atomist: Atomist

atomist.on("/push", m => {
   let push = m.root()
   atomist.messageBuilder().regarding(push).send()
})

atomist.on("/commit", m => {
   let push = m.root()
   atomist.messageBuilder().regarding(push).send()
})
