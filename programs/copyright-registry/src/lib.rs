use anchor_lang::prelude::*;

// Este é o ID único do seu contrato na Solana.
// O Anchor gera isso automaticamente no seu primeiro build.
declare_id!("AizcNEQx22DRGkRZMJURJgao3SJwkYC51YHhVDab8jth");

#[program]
pub mod copyright_registry {
    use super::*;

    /// Função principal que será chamada para registrar um novo direito autoral
    pub fn register_copyright(
        ctx: Context<RegisterCopyright>, 
        content_hash: String, 
        title: String,
        is_pending: bool
    ) -> Result<()> {
        let copyright_account = &mut ctx.accounts.copyright_account;
        let clock = Clock::get()?; 

        copyright_account.owner = ctx.accounts.user.key();
        copyright_account.content_hash = content_hash;
        copyright_account.title = title;
        copyright_account.timestamp = clock.unix_timestamp;
        
        // Define o status: 0 para pendente, 1 para aprovado
        copyright_account.status = if is_pending { 0 } else { 1 };

        msg!("Direito autoral registrado (Status: {}): {}!", copyright_account.status, copyright_account.title);
        
        Ok(())
    }
}

/// ------------------------------------------------------------------------
/// DADOS DA TRANSAÇÃO (Validando as contas envolvidas)
/// ------------------------------------------------------------------------
#[derive(Accounts)]
pub struct RegisterCopyright<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + CopyrightData::INIT_SPACE
    )]
    pub copyright_account: Account<'info, CopyrightData>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

/// ------------------------------------------------------------------------
/// ESTRUTURA DOS DADOS (O que fica salvo na Blockchain)
/// ------------------------------------------------------------------------
#[account]
#[derive(InitSpace)]
pub struct CopyrightData {
    pub owner: Pubkey,
    
    #[max_len(64)]
    pub content_hash: String, 
    
    #[max_len(50)]
    pub title: String,
    
    pub timestamp: i64,
    pub status: u8, // 0 = Pendente, 1 = Aprovado
}