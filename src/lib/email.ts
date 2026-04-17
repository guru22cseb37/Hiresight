import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'HireSight <onboarding@resend.dev>',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Email Error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email Exception:', error);
    return { success: false, error };
  }
}

/**
 * Predefined Email Templates
 */
export const EmailTemplates = {
  InterviewSummary: (candidateName: string, role: string, score: number) => `
    <div style="font-family: sans-serif; padding: 20px; background: #0A0A0F; color: #F8FAFC;">
      <h2 style="color: #3B82F6;">Mock Interview Complete!</h2>
      <p>Hello ${candidateName},</p>
      <p>You've completed your mock interview for the <strong>${role}</strong> position.</p>
      <div style="padding: 20px; border-radius: 12px; background: rgba(255,255,255,0.05); margin: 20px 0;">
        <span style="font-size: 24px; font-weight: bold; color: #3B82F6;">Score: ${score}/100</span>
      </div>
      <p>Log in to HireSight to see your full STAR-format breakdown and areas for improvement.</p>
      <br/>
      <p>Best,<br/>The HireSight Team</p>
    </div>
  `,
  
  RecruiterOutreach: (candidateName: string, jobTitle: string) => `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>Interested in a new role?</h2>
      <p>Hi ${candidateName},</p>
      <p>I saw your profile on HireSight and thought you'd be a great fit for our <strong>${jobTitle}</strong> opening.</p>
      <p>Let's chat!</p>
    </div>
  `
};
