import { Group, type BigNumberish } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import {
  generateProof,
  type SemaphoreProof,
  verifyProof
} from "@semaphore-protocol/proof"

async function main() {
  /** Identities */

  // array of members to add to the group
  const members: BigNumberish[] = []

  /**
   * members are created using the deterministic way so that
   * they can be recreated later using the same secret-message.
   * In this case the secret message is the number i converted to string.
   */
  let identityCommitment: BigNumberish
  for (let i = 0; i < 10; i += 1) {
    identityCommitment = new Identity(i.toString()).commitment
    members.push(identityCommitment)
  }

  /** Groups */

  // create a group with the members above
  const group = new Group(members)

  /** Proofs */

  // scope to prevent double signaling
  const scope = group.root

  const signal = 1

  // generate the proof
  const proof: SemaphoreProof = await generateProof(
    new Identity("1"),
    group,
    scope,
    signal
  )

  // verify the proof
  const verified: boolean = await verifyProof(proof)

  console.log("Proof verified: ", verified)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
