import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CopyrightRegistry } from "../target/types/copyright_registry";
import { assert } from "chai";

describe("copyright_registry", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.CopyrightRegistry as Program<CopyrightRegistry>;

  it("Is initialized and registers a copyright!", async () => {
    // Generate a new keypair for the copyright account
    const copyrightAccount = anchor.web3.Keypair.generate();
    
    // Hash do conteúdo e título de teste
    const testHash = "hash_teste_12345";
    const testTitle = "Minha Obra de Arte Teste";

    // Call the register_copyright instruction
    const tx = await program.methods
      .registerCopyright(testHash, testTitle)
      .accounts({
        copyrightAccount: copyrightAccount.publicKey,
        user: program.provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([copyrightAccount])
      .rpc();

    console.log("Your transaction signature", tx);

    // Fetch the newly created account from the cluster
    const accountInfo = await program.account.copyrightData.fetch(copyrightAccount.publicKey);

    // Validate the data
    assert.strictEqual(accountInfo.owner.toBase58(), program.provider.publicKey.toBase58());
    assert.strictEqual(accountInfo.contentHash, testHash);
    assert.strictEqual(accountInfo.title, testTitle);
    assert.ok(accountInfo.timestamp.toNumber() > 0);
  });
});
