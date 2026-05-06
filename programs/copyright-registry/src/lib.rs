use anchor_lang::prelude::*;

// Este é o ID único do seu contrato na Solana.
// O Anchor gera isso automaticamente no seu primeiro build.
declare_id!("EJFmF3hjjsmqCCnZGn6Sk7SXbBRts7A3f527Dz4cETG6");

#[program]
pub mod copyright_registry {
    use super::*;

    /// Função principal que será chamada para registrar um novo direito autoral
    pub fn register_copyright(
        ctx: Context<RegisterCopyright>, 
        content_hash: String, 
        title: String
    ) -> Result<()> {
        // Pegamos a referência mutável da conta onde os dados serão salvos
        let copyright_account = &mut ctx.accounts.copyright_account;
        
        // Pega o relógio interno da blockchain para registrar a data exata
        let clock = Clock::get()?; 

        // Salvando os dados recebidos dentro da conta
        copyright_account.owner = ctx.accounts.user.key();
        copyright_account.content_hash = content_hash;
        copyright_account.title = title;
        copyright_account.timestamp = clock.unix_timestamp;

        // Imprime uma mensagem de log na transação
        msg!("Direito autoral registrado com sucesso: {}!", copyright_account.title);
        
        Ok(())
    }
}

/// ------------------------------------------------------------------------
/// DADOS DA TRANSAÇÃO (Validando as contas envolvidas)
/// ------------------------------------------------------------------------
#[derive(Accounts)]
pub struct RegisterCopyright<'info> {
    // Definimos como a nova conta de registro será criada
    #[account(
        init, // Diz ao Anchor para inicializar (criar) esta conta
        payer = user, // Quem vai pagar a taxa de criação da conta (o usuário/backend)
        space = 8 + CopyrightData::INIT_SPACE // Cálculo do espaço necessário na blockchain
    )]
    pub copyright_account: Account<'info, CopyrightData>,

    // A pessoa que está assinando a transação e pagando as taxas
    #[account(mut)]
    pub user: Signer<'info>,

    // Programa de sistema da Solana, necessário para criar novas contas
    pub system_program: Program<'info, System>,
}

/// ------------------------------------------------------------------------
/// ESTRUTURA DOS DADOS (O que fica salvo na Blockchain)
/// ------------------------------------------------------------------------
#[account]
#[derive(InitSpace)] // Macro útil para calcular o tamanho da conta automaticamente
pub struct CopyrightData {
    pub owner: Pubkey,             // Chave da carteira do dono (32 bytes)
    
    #[max_len(64)]                 // Tamanho máximo do hash em string (ex: SHA-256)
    pub content_hash: String, 
    
    #[max_len(50)]                 // Tamanho máximo do título
    pub title: String,
    
    pub timestamp: i64,            // Data e hora do registro
}