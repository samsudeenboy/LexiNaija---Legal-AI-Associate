import React, { useState } from 'react';
import { BookOpen, FileText, ChevronRight, Copy, Search, Scale, Briefcase, Building2, Shield, Feather, Gavel, FileSignature, Bookmark, Star, Clock } from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { AppView, SavedDocument } from '../types';

interface PrecedentsProps {
  onNavigate: (view: AppView) => void;
}

interface Template {
  id: string;
  category: string;
  title: string;
  description: string;
  content: string;
  jurisdiction?: string;
  court?: string;
  isFavorite?: boolean;
}

const TEMPLATES: Template[] = [
  // --- CIVIL LITIGATION ---
  {
    id: 'lit1',
    category: 'Civil Litigation',
    title: 'Motion Ex-Parte for Substituted Service',
    description: 'Application to serve court processes by substitution (e.g. pasting at address).',
    jurisdiction: 'Lagos State',
    court: 'High Court',
    content: `# [COURT]
# [DIVISION]
# HOLDEN AT [LOCATION]

SUIT NO: ....................

BETWEEN:

[PLAINTIFF NAME]   ........................................   CLAIMANT/APPLICANT

AND

[DEFENDANT NAME]   ........................................   DEFENDANT/RESPONDENT

## MOTION EX-PARTE
**BROUGHT PURSUANT TO ORDER 7 RULE 5 OF THE HIGH COURT OF LAGOS STATE (CIVIL PROCEDURE) RULES 2019 AND UNDER THE INHERENT JURISDICTION OF THIS HONOURABLE COURT**

**TAKE NOTICE** that this Honourable Court will be moved on the ...... day of ...... 20.... at the hour of 9 o'clock in the forenoon or so soon thereafter as Counsel for the Claimant/Applicant may be heard praying the Court for the following orders:

1. **AN ORDER** of this Honourable Court granting leave to the Claimant/Applicant to serve the Writ of Summons and other originating processes in this suit on the Defendant by substituted means, to wit: by pasting same on the entrance gate or conspicuous part of the Defendant's last known address at [ADDRESS].

2. **AND FOR SUCH FURTHER ORDER(S)** as this Honourable Court may deem fit to make in the circumstances.

**DATED THIS ...... DAY OF ...... 20....**

__________________________
**[LAWYER NAME]**
Counsel to the Applicant
[FIRM ADDRESS]`
  },
  {
    id: 'lit2',
    category: 'Civil Litigation',
    title: 'Affidavit of Urgency',
    description: 'Supporting affidavit for urgent applications (e.g., Injunctions).',
    jurisdiction: 'Lagos State',
    court: 'High Court',
    content: `# [COURT]
# HOLDEN AT [LOCATION]

SUIT NO: ....................

BETWEEN:

[PLAINTIFF NAME]   .......   CLAIMANT

AND

[DEFENDANT NAME]   .......   DEFENDANT

## AFFIDAVIT OF URGENCY

I, [DEPONENT NAME], Male/Female, Christian/Muslim, Nigerian Citizen of [ADDRESS], do hereby make Oath and state as follows:

1. That I am the Claimant in this suit and by virtue of my position, I am conversant with the facts deposed herein.
2. That the res (subject matter) of this suit is at imminent risk of being destroyed/dissipated by the Defendant unless restrained.
3. That the Defendant has threatened to [Specific Threat] as shown in Exhibit A attached.
4. That unless this Honourable Court intervenes urgently, the judgment of this court will be rendered nugatory.
5. That it is in the interest of justice to grant this application.
6. That I swear to this Affidavit in good faith believing the contents to be true and correct in accordance with the Oaths Act.

__________________________
**DEPONENT**

**SWORN TO** at the High Court Registry, Lagos.
This ...... day of ...... 20....

**BEFORE ME**

**COMMISSIONER FOR OATHS**`
  },
  {
    id: 'lit3',
    category: 'Civil Litigation',
    title: 'Writ of Summons (General)',
    description: 'Standard Writ of Summons for commencing civil actions.',
    jurisdiction: 'Lagos State',
    court: 'High Court',
    content: `# [COURT]
# [DIVISION]
# HOLDEN AT [LOCATION]

SUIT NO: ....................

BETWEEN:

[PLAINTIFF NAME]   ........................................   CLAIMANT

AND

[DEFENDANT NAME]   ........................................   DEFENDANT

## WRIT OF SUMMONS

**TO THE DEFENDANT:** [DEFENDANT NAME] of [ADDRESS].

**YOU ARE HEREBY COMMANDED** that within forty-two (42) days after the service of this Writ on you, inclusive of the day of such service, you do cause an appearance to be entered for you in an action at the suit of [PLAINTIFF NAME]; and take notice that in default of your so doing, the Claimant may proceed therein, and judgment may be given in your absence.

**DATED THIS ...... DAY OF ...... 20....**

__________________________
**REGISTRAR**

**MEMORANDUM TO BE SUBSCRIBED ON THE WRIT**
N.B: This writ is to be served within six calendar months from the date thereof, or, if renewed, within three calendar months from the date of the last renewal, including the day of such date, and not afterwards.

**THE CLAIMANT'S CLAIM IS FOR:**
1. **A DECLARATION** that...
2. **DAMAGES** in the sum of...
3. **PERMANENT INJUNCTION** restraining...

__________________________
**[LAWYER NAME]**
Counsel to the Claimant
[FIRM ADDRESS]
[PHONE NUMBER]
[EMAIL]`
  },

  // --- PROPERTY & TENANCY ---
  {
    id: 'prop1',
    category: 'Property',
    title: 'Notice to Quit (Generic)',
    description: 'Statutory notice to determine tenancy.',
    jurisdiction: 'Generic',
    content: `[DATE]

TO:
[TENANT NAME]
[ADDRESS OF PROPERTY]

## NOTICE TO QUIT

**TAKE NOTICE** that you are required to quit and deliver up possession of the [DESCRIPTION OF PROPERTY e.g., 2 Bedroom Flat] with the appurtenances situate at [ADDRESS] which you hold of me as tenant thereof, on the ...... day of ...... 20.... or at the expiration of your current term of tenancy which shall expire next after the end of [NOTICE PERIOD] months from the service of this notice.

**DATED THIS ...... DAY OF ...... 20....**

__________________________
**[LANDLORD/SOLICITOR NAME]**
(Landlord / Solicitor to Landlord)`
  },
  {
    id: 'prop2',
    category: 'Property',
    title: "7 Days Notice of Owner's Intention",
    description: 'Notice to recover possession after expiry of Notice to Quit.',
    jurisdiction: 'Generic',
    content: `[DATE]

TO:
[TENANT NAME]
[ADDRESS OF PROPERTY]

## NOTICE OF OWNER'S INTENTION TO APPLY TO RECOVER POSSESSION

**I, [OWNER/AGENT NAME]**, the Owner (or Agent to the Owner) do hereby give you notice that unless peaceable possession of the premises situate at [ADDRESS] which you held of me under a tenancy from year to year (or as the case may be) which tenancy has been determined by a Notice to Quit dated the .... day of .... 20...., is given to me on or before the expiration of SEVEN (7) CLEAR DAYS from the service of this notice, I shall on [DATE] apply to the Magistrate Court District for a summons to eject any person therefrom.

**DATED THIS ...... DAY OF ...... 20....**

__________________________
**[SIGNATURE]**
Owner / Solicitor`
  },
  {
    id: 'prop3',
    category: 'Property',
    title: 'Deed of Assignment (Land)',
    description: 'Transfer of title to land between Assignor and Assignee.',
    jurisdiction: 'Generic',
    content: `**THIS DEED OF ASSIGNMENT** is made this ...... day of ...... 20....

**BETWEEN**

**[ASSIGNOR NAME]** of [ADDRESS] (hereinafter referred to as "THE ASSIGNOR") of the one part.

**AND**

**[ASSIGNEE NAME]** of [ADDRESS] (hereinafter referred to as "THE ASSIGNEE") of the other part.

**WHEREAS:**
1. The Assignor is the beneficial owner of the piece of land situate at [LAND ADDRESS] measuring approximately [SIZE] square meters.
2. The Assignor has agreed to assign his entire unexpired residue interest in the land to the Assignee for a consideration of N[AMOUNT].

**NOW THIS DEED WITNESSES AS FOLLOWS:**
1. **CONSIDERATION:** In consideration of the sum of N[AMOUNT] paid by the Assignee to the Assignor (the receipt whereof the Assignor hereby acknowledges).
2. **ASSIGNMENT:** The Assignor as Beneficial Owner hereby ASSIGNS unto the Assignee ALL that parcel of land situate at [ADDRESS] TO HOLD the same unto the Assignee for the unexpired residue of the term of years granted by the Certificate of Occupancy dated .... registered as No .... at Page .... in Volume .... of the Lands Registry, [STATE].
3. **INDEMNITY:** The Assignor covenants to indemnify the Assignee against any adverse claim.

**IN WITNESS WHEREOF** the parties have set their hands and seals.

**SIGNED, SEALED AND DELIVERED**
by the within named **ASSIGNOR**

__________________________
In the presence of:
Name: ....................
Address: .................
Signature: ...............

**SIGNED, SEALED AND DELIVERED**
by the within named **ASSIGNEE**

__________________________
In the presence of:
Name: ....................
Address: .................
Signature: ...............`
  },
  {
    id: 'prop4',
    category: 'Property',
    title: 'Tenancy Agreement (Residential)',
    description: 'Standard agreement for residential tenancy.',
    jurisdiction: 'Generic',
    content: `**THIS TENANCY AGREEMENT** is made this .... day of .... 20....

**BETWEEN**

**[LANDLORD NAME]** (The Landlord)
AND
**[TENANT NAME]** (The Tenant)

**PREMISES:** [Description of Apartment/House] at [Address].
**RENT:** N[Amount] per annum.
**TERM:** One (1) Year commencing on [Date] and ending on [Date].

**THE TENANT COVENANTS:**
1. To pay rent in advance.
2. To keep the interior in good repair.
3. Not to sublet without written consent.
4. To pay all utility bills (electricity, waste, water).
5. To use the premises for residential purposes only.

**THE LANDLORD COVENANTS:**
1. To ensure quiet enjoyment of the premises.
2. To keep the structural parts (roof, walls) in repair.

**TERMINATION:**
This tenancy requires [Number] months' notice in writing to determine.

**SIGNED** by the Parties.

____________________        ____________________
**LANDLORD**                **TENANT**`
  },

  // --- CORPORATE & COMMERCIAL ---
  {
    id: 'corp1',
    category: 'Corporate',
    title: 'Board Resolution (Generic)',
    description: 'Resolution of the Board of Directors for general matters.',
    jurisdiction: 'Generic',
    content: `**BOARD RESOLUTION OF [COMPANY NAME] LTD**
**Held at:** [Address]
**On:** [Date]

**PRESENT:**
1. [Director Name] - Chairman
2. [Director Name]
3. [Secretary Name]

**BUSINESS OF THE DAY:**
To consider and approve [Topic e.g., Opening of Bank Account].

**IT WAS RESOLVED:**
1. THAT the Company opens a corporate account with [Bank Name].
2. THAT the signatories to the account be [Name A] and [Name B].
3. THAT the mandate be "Both to sign".

**DATED THIS ...... DAY OF ...... 20....**

__________________________      __________________________
**DIRECTOR**                    **SECRETARY**`
  },
  {
    id: 'corp2',
    category: 'Corporate',
    title: 'Employment Contract',
    description: 'Standard contract of employment for staff.',
    jurisdiction: 'Generic',
    content: `**CONTRACT OF EMPLOYMENT**

**DATE:** [Date]
**EMPLOYER:** [Company Name]
**EMPLOYEE:** [Employee Name]

**1. POSITION**
You are employed as [Job Title].

**2. COMMENCEMENT & PROBATION**
Employment starts on [Date]. You will be on probation for [Number] months.

**3. REMUNERATION**
Your gross annual salary is N[Amount], payable monthly in arrears.

**4. HOURS OF WORK**
8:00am to 5:00pm, Monday to Friday.

**5. LEAVE**
You are entitled to [Number] working days annual leave.

**6. TERMINATION**
During probation: 2 weeks notice.
After confirmation: 1 month notice or salary in lieu.

**7. CONFIDENTIALITY**
You shall not disclose company trade secrets.

**ACCEPTED BY:**

__________________________
**[EMPLOYEE SIGNATURE]**`
  },
  {
    id: 'corp3',
    category: 'Corporate',
    title: 'Letter of Demand (Debt)',
    description: 'Formal demand for payment of outstanding debt.',
    jurisdiction: 'Generic',
    content: `[FIRM LETTERHEAD]

[DATE]

[DEBTOR NAME]
[ADDRESS]

Dear Sir/Madam,

**DEMAND FOR PAYMENT OF OUTSTANDING SUM OF N[AMOUNT]**

We act as Solicitors to **[CLIENT NAME]** ("our Client") on whose instruction we write.

It is our instruction that you are indebted to our Client in the sum of **N[Amount]** being the outstanding balance for [Goods/Services] supplied to you on [Date].

Despite repeated demands, you have failed, refused, or neglected to liquidate this debt.

**TAKE NOTICE** that unless the said sum of **N[Amount]** is paid to our Client within **SEVEN (7) DAYS** of the receipt of this letter, we have strict instructions to commence legal proceedings against you for the recovery of the debt, accrued interest, and legal costs without further recourse to you.

We advise you to heed this wise counsel.

Yours faithfully,

__________________________
**PP: [LAW FIRM NAME]**`
  },

  // --- FAMILY & PROBATE ---
  {
    id: 'fam1',
    category: 'Family',
    title: 'Simple Will',
    description: 'Last Will and Testament for simple estate distribution.',
    jurisdiction: 'Generic',
    content: `**THIS IS THE LAST WILL AND TESTAMENT** of me **[TESTATOR NAME]** of [Address].

1. **REVOCATION:** I REVOKE all former Wills and testamentary dispositions made by me.
2. **EXECUTORS:** I APPOINT [Name 1] and [Name 2] to be the Executors and Trustees of this my Will.
3. **BURIAL:** I wish to be buried in a Christian/Muslim manner at [Location].
4. **BEQUESTS:**
   a) I GIVE my house at [Address] to my wife/husband [Name].
   b) I GIVE my shares in [Company] to my son [Name].
   c) I GIVE the residue of my estate to my children in equal shares.

**IN WITNESS WHEREOF** I have hereunto set my hand this .... day of .... 20....

__________________________
**TESTATOR**

**SIGNED** by the Testator in our joint presence and then by us in his/her presence.

**WITNESS 1:**
Name: ....................
Signature: ...............

**WITNESS 2:**
Name: ....................
Signature: ...............`
  },
  {
    id: 'fam2',
    category: 'Family',
    title: 'Divorce Petition (Grounds)',
    description: 'Excerpt of grounds for dissolution of marriage.',
    jurisdiction: 'Generic',
    content: `**GROUNDS FOR RELIEF**

The Petitioner seeks a decree of dissolution of marriage on the ground that the marriage has broken down irretrievably in that:

(a) Since the marriage, the Respondent has willfully and persistently refused to consummate the marriage.
(b) Since the marriage, the Respondent has committed adultery and the Petitioner finds it intolerable to live with the Respondent.
(c) Since the marriage, the Respondent has behaved in such a way that the Petitioner cannot reasonably be expected to live with the Respondent.
(d) The Respondent has deserted the Petitioner for a continuous period of at least one year immediately preceding the presentation of this petition.
(e) The parties to the marriage have lived apart for a continuous period of at least two years immediately preceding the presentation of the petition and the Respondent does not object to a decree being granted.
(f) The parties to the marriage have lived apart for a continuous period of at least three years immediately preceding the presentation of the petition.

**PARTICULARS OF BEHAVIOUR:**
1. That on [Date], the Respondent...`
  },

  {
    id: 'lit4',
    category: 'Civil Litigation',
    title: 'Motion on Notice for Interlocutory Injunction',
    description: 'Application restraining the Defendant pending determination of the suit.',
    jurisdiction: 'FCT, Abuja',
    court: 'High Court',
    content: `# [COURT]
# [DIVISION]
# HOLDEN AT [LOCATION]

SUIT NO: [SUIT NO]

BETWEEN:

[PLAINTIFF NAME]   ........................................   CLAIMANT/APPLICANT

AND

[DEFENDANT NAME]   ........................................   DEFENDANT/RESPONDENT

## MOTION ON NOTICE
BROUGHT PURSUANT TO ORDER 43 OF THE HIGH COURT OF THE FCT CIVIL PROCEDURE RULES AND UNDER THE INHERENT JURISDICTION OF THIS HONOURABLE COURT

TAKE NOTICE that the Court will be moved on the ...... day of ...... 20.... or so soon thereafter by Counsel to the Claimant praying for:

1. AN ORDER of interlocutory injunction restraining the Defendant, his servants, agents or privies from further interfering with the res pending the determination of this suit.
2. AND FOR SUCH FURTHER ORDER(S) as this Honourable Court may deem fit.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]
[FIRM ADDRESS]`
  },

  {
    id: 'lit5',
    category: 'Civil Litigation',
    title: 'Statement of Claim',
    description: 'Pleading setting out material facts and reliefs sought.',
    jurisdiction: 'Rivers State',
    court: 'High Court',
    content: `# [COURT]
# [DIVISION]
# HOLDEN AT [LOCATION]

SUIT NO: [SUIT NO]

BETWEEN:

[PLAINTIFF NAME]   ........................................   CLAIMANT

AND

[DEFENDANT NAME]   ........................................   DEFENDANT

## STATEMENT OF CLAIM

1. The Claimant is a Nigerian citizen of address at [ADDRESS].
2. The Defendant is a Nigerian citizen whose address is [ADDRESS].
3. By a contract dated [DATE], the Defendant agreed to [Summary].
4. The Defendant breached the contract by [Particulars].
5. As a result, the Claimant suffered loss and damage.

WHEREOF the Claimant claims against the Defendant as follows:
1. Damages in the sum of N[AMOUNT].
2. Interest at the rate of [RATE]% per annum from [DATE] until judgment.
3. Costs of this action.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]
[FIRM ADDRESS]`
  },

  {
    id: 'lit6',
    category: 'Civil Litigation',
    title: 'Originating Summons (Federal High Court)',
    description: 'Proceedings commenced by originating summons under Federal High Court Rules.',
    jurisdiction: 'Federal',
    court: 'Federal High Court',
    content: `# FEDERAL HIGH COURT OF NIGERIA
# [DIVISION]
# HOLDEN AT [LOCATION]

SUIT NO: [SUIT NO]

IN THE MATTER OF: [SUBJECT]

AND IN THE MATTER OF: [STATUTE/REGULATION]

BETWEEN:

[PLAINTIFF NAME]   ........................................   APPLICANT

AND

[DEFENDANT NAME]   ........................................   RESPONDENT

## ORIGINATING SUMMONS

Let the Respondent within 30 days after service of this Summons on him, inclusive of the day of such service, cause an appearance to be entered to this Summons, and take notice that in default of his so doing, the Applicant may proceed therein and judgment may be given in his absence.

Questions for determination:
1. Whether on the proper construction of [STATUTE], the Applicant is entitled to [Relief].

Reliefs sought:
1. A DECLARATION that ...
2. AN ORDER directing ...

DATED THIS ...... DAY OF ...... 20....

__________________________
REGISTRAR`
  },

  {
    id: 'prop5',
    category: 'Property',
    title: 'Notice to Quit (Lagos Tenancy Law)',
    description: 'State-specific notice in compliance with Lagos Tenancy Law 2011.',
    jurisdiction: 'Lagos State',
    court: 'Magistrate Court',
    content: `[DATE]

TO:
[TENANT NAME]
[ADDRESS]

TAKE NOTICE that pursuant to the Lagos State Tenancy Law 2011, you are required to quit and deliver up possession of the premises known as [ADDRESS] being a [MONTHLY/YEARLY] tenancy on or before the expiration of [NOTICE PERIOD] months from the service of this notice.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LANDLORD NAME]
or Counsel`
  },

  {
    id: 'prop6',
    category: 'Property',
    title: 'Commercial Tenancy Agreement',
    description: 'Lease agreement for commercial premises.',
    jurisdiction: 'Rivers State',
    court: 'High Court',
    content: `THIS COMMERCIAL TENANCY AGREEMENT is made this ...... day of ...... 20....

BETWEEN [LANDLORD NAME] and [TENANT NAME]

PREMISES: [Address]
RENT: N[Amount] per annum
TERM: [Years] years commencing [DATE]
USE: Commercial purposes only

Key Terms:
1. Service Charge: N[Amount] payable quarterly.
2. Repairs: Tenant responsible for internal; Landlord for structural.
3. Insurance: Tenant to insure contents; Landlord to insure building.
4. Termination: [Months] notice.

SIGNED:
LANDLORD ................................  TENANT ................................`
  },

  {
    id: 'corp4',
    category: 'Corporate',
    title: 'Special Resolution — Change of Company Name',
    description: 'Shareholders’ special resolution pursuant to CAMA 2020.',
    jurisdiction: 'Federal',
    content: `SPECIAL RESOLUTION OF [COMPANY NAME] LTD PASSED ON [DATE]

IT WAS RESOLVED THAT the name of the Company be changed from [OLD NAME] to [NEW NAME], subject to the approval of the Corporate Affairs Commission.

That the Directors be and are hereby authorized to take all steps necessary to give effect to this resolution.

__________________________
CHAIRMAN`
  },

  {
    id: 'crim1',
    category: 'Criminal',
    title: 'Bail Application (Magistrate Court)',
    description: 'Application for bail pending trial.',
    jurisdiction: 'Lagos State',
    court: 'Magistrate Court',
    content: `IN THE MAGISTRATE COURT OF LAGOS STATE HOLDEN AT [LOCATION]

CHARGE NO: [SUIT NO]

BETWEEN:

THE STATE   ........................................   COMPLAINANT

AND

[CLIENT NAME]   ........................................   DEFENDANT/APPLICANT

MOTION ON NOTICE

BROUGHT PURSUANT TO THE LAGOS STATE ADMINISTRATION OF CRIMINAL JUSTICE LAW AND UNDER THE INHERENT JURISDICTION OF THIS COURT

1. AN ORDER admitting the Applicant to bail on liberal terms.
2. AND FOR SUCH FURTHER ORDER(S) as the Court may deem fit.

GROUNDS:
1. The Applicant is presumed innocent.
2. The Applicant has reliable sureties and a fixed address at [ADDRESS].

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'crim2',
    category: 'Criminal',
    title: 'Motion for Variation of Bail Conditions',
    description: 'Application to vary onerous bail terms.',
    jurisdiction: 'Federal',
    court: 'Federal High Court',
    content: `IN THE FEDERAL HIGH COURT HOLDEN AT [LOCATION]

SUIT/CHARGE NO: [SUIT NO]

BETWEEN:

FEDERAL REPUBLIC OF NIGERIA   ................................   COMPLAINANT

AND

[CLIENT NAME]   ........................................   DEFENDANT/APPLICANT

MOTION ON NOTICE

1. AN ORDER varying the bail terms to allow the Applicant meet same.
2. AND FOR SUCH FURTHER ORDER(S) as the Court may deem fit.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'prob1',
    category: 'Probate',
    title: 'Petition for Letters of Administration',
    description: 'Application for Letters of Administration over intestate estate.',
    jurisdiction: 'Lagos State',
    court: 'High Court (Probate)',
    content: `IN THE HIGH COURT OF LAGOS STATE (PROBATE REGISTRY) HOLDEN AT [LOCATION]

IN THE ESTATE OF [DECEASED NAME] (DECEASED)

PETITIONERS: [CLIENT NAME] and [CO-PETITIONER NAME]

The Petitioners humbly apply for the grant of Letters of Administration over the estate of the above-named deceased who died intestate on [DATE].

Grounds:
1. The Petitioners are lawful next-of-kin.
2. Assets include property at [ADDRESS] and bank accounts at [BANK].

DATED THIS ...... DAY OF ...... 20....

__________________________
PETITIONERS`
  },

  {
    id: 'prob2',
    category: 'Probate',
    title: 'Oath of Executor',
    description: 'Executor’s oath in support of probate grant.',
    jurisdiction: 'Ogun State',
    court: 'High Court (Probate)',
    content: `I, [CLIENT NAME], of [ADDRESS], do make Oath and say that I will well and truly administer the estate of [TESTATOR NAME], pay all debts, legacies and bequests, and render a true account when lawfully required.

SWORN TO at the Probate Registry, Ogun State this ...... day of ...... 20....

BEFORE ME
COMMISSIONER FOR OATHS`
  },

  {
    id: 'app1',
    category: 'Appellate',
    title: 'Notice of Appeal (Civil)',
    description: 'Appeal to the Court of Appeal against High Court judgment.',
    jurisdiction: 'Rivers State',
    court: 'Court of Appeal, Port Harcourt Division',
    content: `IN THE COURT OF APPEAL HOLDEN AT PORT HARCOURT

APPEAL NO: [SUIT NO]

BETWEEN:

[PLAINTIFF NAME]   ........................................   APPELLANT

AND

[DEFENDANT NAME]   ........................................   RESPONDENT

NOTICE OF APPEAL

Take notice that the Appellant appeals to the Court of Appeal against the whole of the decision of the High Court delivered on [DATE].

GROUNDS OF APPEAL:
1. The learned trial judge erred in law when ...

RELIEFS SOUGHT:
1. Allow the appeal and set aside the judgment.

DATED THIS ...... DAY OF ...... 20....

__________________________
COUNSEL TO THE APPELLANT`
  },

  {
    id: 'app2',
    category: 'Appellate',
    title: 'Motion for Extension of Time (Court of Appeal)',
    description: 'Application for extension of time to compile record or file brief.',
    jurisdiction: 'FCT, Abuja',
    court: 'Court of Appeal, Abuja Division',
    content: `IN THE COURT OF APPEAL HOLDEN AT ABUJA

APPEAL NO: [SUIT NO]

MOTION ON NOTICE

1. AN ORDER extending time within which the Appellant may file the Appellant’s Brief.
2. AND FOR SUCH FURTHER ORDER(S) as the Court may deem fit.

GROUNDS:
1. Delay was due to circumstances beyond control.

DATED THIS ...... DAY OF ...... 20....

__________________________
COUNSEL`
  },

  {
    id: 'fam3',
    category: 'Family',
    title: 'Petition for Custody',
    description: 'Matrimonial cause seeking custody of minor children.',
    jurisdiction: 'Kano State',
    court: 'High Court',
    content: `IN THE HIGH COURT OF KANO STATE HOLDEN AT [LOCATION]

SUIT NO: [SUIT NO]

BETWEEN:

[PLAINTIFF NAME]   ........................................   PETITIONER

AND

[DEFENDANT NAME]   ........................................   RESPONDENT

RELIEFS:
1. An order granting custody of the minor children to the Petitioner.
2. An order for maintenance.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'lit7',
    category: 'Civil Litigation',
    title: 'Motion to Set Aside Default Judgment',
    description: 'Application to set aside judgment entered in default of appearance.',
    jurisdiction: 'Kaduna State',
    court: 'High Court',
    content: `MOTION ON NOTICE brought under Order [X] of the Kaduna State High Court Rules praying:

1. AN ORDER setting aside the default judgment entered on [DATE].
2. AND FOR SUCH FURTHER ORDER(S) as the Court may deem fit.

GROUNDS:
1. The Defendant was not served with the originating processes.
2. The Defendant has a meritorious defence.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'lit8',
    category: 'Civil Litigation',
    title: 'Witness Statement on Oath',
    description: 'Template of Witness Statement in support of pleadings.',
    jurisdiction: 'Oyo State',
    court: 'High Court',
    content: `I, [CLIENT NAME], of [ADDRESS], make Oath and state:

1. That I am the Claimant/Defendant in this suit.
2. That the facts herein are within my personal knowledge.
3. [Facts]

SWORN TO at the High Court Registry, [LOCATION] this ...... day of ...... 20....

BEFORE ME
COMMISSIONER FOR OATHS`
  },

  {
    id: 'lit9',
    category: 'Civil Litigation',
    title: 'Motion for Summary Judgment',
    description: 'Application under summary judgment procedure.',
    jurisdiction: 'Anambra State',
    court: 'High Court',
    content: `MOTION ON NOTICE brought pursuant to Order [X] of the Anambra State High Court (Civil Procedure) Rules praying:

1. AN ORDER entering summary judgment in favour of the Claimant for the sum of N[AMOUNT].
2. AND FOR SUCH FURTHER ORDER(S) as the Court may deem fit.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'lit10',
    category: 'Civil Litigation',
    title: 'Statement of Defence',
    description: 'Defendant’s responsive pleading.',
    jurisdiction: 'Enugu State',
    court: 'High Court',
    content: `# [COURT]
# [DIVISION]
# HOLDEN AT [LOCATION]

SUIT NO: [SUIT NO]

BETWEEN:

[PLAINTIFF NAME]   ........................................   CLAIMANT

AND

[DEFENDANT NAME]   ........................................   DEFENDANT

## STATEMENT OF DEFENCE

1. The Defendant denies paragraphs [X] of the Statement of Claim and puts the Claimant to the strictest proof.
2. In further answer, the Defendant states that [Facts].
3. The suit is frivolous and an abuse of court process.

WHEREFORE the Defendant prays the Court to dismiss the suit.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'prop7',
    category: 'Property',
    title: 'Notice to Quit (Delta State)',
    description: 'Recovery of premises procedure — state-tagged.',
    jurisdiction: 'Delta State',
    court: 'Magistrate Court',
    content: `[DATE]

TO: [TENANT NAME]
ADDRESS: [ADDRESS]

TAKE NOTICE that you are required to quit and deliver up possession of the premises known as [ADDRESS] on or before [NOTICE PERIOD] months from service of this notice.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LANDLORD NAME]`
  },

  {
    id: 'corp5',
    category: 'Corporate',
    title: 'Special Resolution — Increase of Share Capital',
    description: 'Shareholders’ special resolution under CAMA 2020.',
    jurisdiction: 'Federal',
    content: `SPECIAL RESOLUTION OF [COMPANY NAME] LTD

IT WAS RESOLVED THAT the issued share capital of the Company be increased from [OLD CAPITAL] to [NEW CAPITAL] by the creation of [NUMBER] shares of [VALUE] each.

Directors are authorized to file necessary returns with the CAC.

__________________________
CHAIRMAN`
  },

  {
    id: 'prob3',
    category: 'Probate',
    title: 'Affidavit of Next of Kin',
    description: 'In support of Letters of Administration.',
    jurisdiction: 'Anambra State',
    court: 'High Court (Probate)',
    content: `I, [CLIENT NAME], of [ADDRESS], make Oath and say:

1. That I am the lawful next of kin of [DECEASED NAME].
2. That the deceased died intestate on [DATE].
3. That I undertake to administer the estate according to law.

SWORN TO at the Probate Registry, Anambra State this ...... day of ...... 20....

BEFORE ME
COMMISSIONER FOR OATHS`
  },

  {
    id: 'app3',
    category: 'Appellate',
    title: 'Notice of Appeal (Criminal)',
    description: 'Appeal against conviction/sentence.',
    jurisdiction: 'Lagos State',
    court: 'Court of Appeal, Lagos Division',
    content: `IN THE COURT OF APPEAL HOLDEN AT LAGOS

APPEAL NO: [SUIT NO]

BETWEEN:

[APPELLANT NAME]   ........................................   APPELLANT

AND

THE STATE   ........................................   RESPONDENT

NOTICE OF APPEAL (CRIMINAL)

Grounds include:
1. The learned trial judge erred in law in admitting [Evidence].
2. The sentence is manifestly excessive.

RELIEF: Allow the appeal and set aside the conviction/sentence.

DATED THIS ...... DAY OF ...... 20....

__________________________
COUNSEL`
  },

  {
    id: 'fam4',
    category: 'Family',
    title: 'Application for Maintenance',
    description: 'Application for maintenance of spouse/children.',
    jurisdiction: 'Ebonyi State',
    court: 'High Court',
    content: `MOTION ON NOTICE praying:

1. AN ORDER directing the Respondent to pay monthly maintenance of N[AMOUNT] for the minor children.
2. AND FOR SUCH FURTHER ORDER(S) as the Court may deem fit.

GROUNDS: [Facts]

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'nicn1',
    category: 'Corporate',
    title: 'General Form of Complaint (NICN)',
    description: 'Commencing employment dispute at NICN.',
    jurisdiction: 'Federal',
    court: 'National Industrial Court of Nigeria',
    content: `IN THE NATIONAL INDUSTRIAL COURT OF NIGERIA HOLDEN AT [LOCATION]

SUIT NO: [SUIT NO]

BETWEEN:

[CLAIMANT NAME]   ........................................   CLAIMANT

AND

[DEFENDANT NAME]   ........................................   DEFENDANT

GENERAL FORM OF COMPLAINT

The Claimant’s claim against the Defendant is as follows:
1. Payment of outstanding salaries in the sum of N[AMOUNT].
2. Damages for wrongful termination.

DATED THIS ...... DAY OF ...... 20....

__________________________
REGISTRAR`
  },

  {
    id: 'fhc1',
    category: 'Civil Litigation',
    title: 'Fundamental Rights Application (FHC)',
    description: 'Enforcement of Fundamental Rights under FREP Rules.',
    jurisdiction: 'Federal',
    court: 'Federal High Court',
    content: `IN THE FEDERAL HIGH COURT HOLDEN AT [LOCATION]

SUIT NO: [SUIT NO]

IN THE MATTER OF AN APPLICATION FOR THE ENFORCEMENT OF FUNDAMENTAL RIGHTS

BETWEEN:

[APPLICANT NAME]   ........................................   APPLICANT

AND

[RESPONDENT NAME]   ........................................   RESPONDENT

MOTION ON NOTICE and STATEMENT in support seeking:
1. DECLARATION that the arrest/detention of the Applicant is unlawful.
2. ORDER compelling the Respondent to release the Applicant forthwith.
3. DAMAGES in the sum of N[AMOUNT].

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'lit11',
    category: 'Civil Litigation',
    title: 'Notice of Discontinuance',
    description: 'Claimant discontinues suit.',
    jurisdiction: 'Edo State',
    court: 'High Court',
    content: `# [COURT]
# [DIVISION]
# HOLDEN AT [LOCATION]

SUIT NO: [SUIT NO]

BETWEEN:

[PLAINTIFF NAME]   ........................................   CLAIMANT

AND

[DEFENDANT NAME]   ........................................   DEFENDANT

## NOTICE OF DISCONTINUANCE

TAKE NOTICE that the Claimant hereby wholly discontinues this suit against the Defendant.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'lit12',
    category: 'Civil Litigation',
    title: 'Subpoena ad Testificandum',
    description: 'Command to attend court to give evidence.',
    jurisdiction: 'Kwara State',
    court: 'High Court',
    content: `TO: [WITNESS NAME] of [ADDRESS]

YOU ARE HEREBY COMMANDED to attend before the High Court of Kwara State holden at [LOCATION] on the ...... day of ...... 20.... at [TIME] to testify in the above suit and to remain until you are discharged.

DATED THIS ...... DAY OF ...... 20....

__________________________
REGISTRAR`
  },

  {
    id: 'lit13',
    category: 'Civil Litigation',
    title: 'Subpoena Duces Tecum',
    description: 'Command to produce documents in court.',
    jurisdiction: 'Oyo State',
    court: 'High Court',
    content: `TO: [WITNESS NAME] of [ADDRESS]

YOU ARE HEREBY COMMANDED to bring with you and produce at the High Court holden at [LOCATION] on the ...... day of ...... 20.... the following documents: [DOCUMENTS].

DATED THIS ...... DAY OF ...... 20....

__________________________
REGISTRAR`
  },

  {
    id: 'lit14',
    category: 'Civil Litigation',
    title: 'Motion for Joinder of Parties',
    description: 'Application to join necessary parties.',
    jurisdiction: 'Ogun State',
    court: 'High Court',
    content: `MOTION ON NOTICE praying:

1. AN ORDER joining [PARTY NAME] as a necessary party to this suit.
2. AND FOR SUCH FURTHER ORDER(S) as the Court may deem fit.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'lit15',
    category: 'Civil Litigation',
    title: 'Motion for Leave to Amend Pleadings',
    description: 'Application to amend processes.',
    jurisdiction: 'Ekiti State',
    court: 'High Court',
    content: `MOTION ON NOTICE praying:

1. AN ORDER granting leave to amend the Statement of Claim in terms of the Schedule annexed.
2. AND FOR SUCH FURTHER ORDER(S) as the Court may deem fit.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'lit16',
    category: 'Civil Litigation',
    title: 'Notice of Change of Counsel',
    description: 'Formal notice substituting counsel on record.',
    jurisdiction: 'Kano State',
    court: 'High Court',
    content: `TAKE NOTICE that henceforth **[NEW FIRM NAME]** of [FIRM ADDRESS] will represent the **[PLAINTIFF/DEFENDANT]** in place of **[OLD FIRM NAME]** in this suit.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'prop8',
    category: 'Property',
    title: 'Commercial Tenancy Agreement (Lagos)',
    description: 'Lease for commercial use under Lagos law.',
    jurisdiction: 'Lagos State',
    court: 'High Court',
    content: `THIS COMMERCIAL TENANCY AGREEMENT is made this ...... day of ...... 20....

BETWEEN [LANDLORD NAME] and [TENANT NAME]

PREMISES: [Address]
RENT: N[AMOUNT] per annum
TERM: [Years] years commencing [DATE]
USE: Commercial purposes only

Key Terms:
1. Service Charge: N[AMOUNT].
2. Repairs and maintenance responsibilities.
3. Insurance obligations.
4. Termination: [Months] notice.

SIGNED:
LANDLORD ................................  TENANT ................................`
  },

  {
    id: 'crim3',
    category: 'Criminal',
    title: 'Information (Criminal — High Court)',
    description: 'Prosecutor’s information to commence criminal trial.',
    jurisdiction: 'Ogun State',
    court: 'High Court',
    content: `IN THE HIGH COURT OF OGUN STATE HOLDEN AT [LOCATION]

CHARGE/CASE NO: [SUIT NO]

THE STATE
v.
[DEFENDANT NAME]

INFORMATION

Count 1: That you, [DEFENDANT NAME], on [DATE] at [LOCATION], did [OFFENCE DESCRIPTION], contrary to and punishable under [SECTION/LAW].

DATED THIS ...... DAY OF ...... 20....

__________________________
DIRECTOR OF PUBLIC PROSECUTIONS`
  },

  {
    id: 'crim4',
    category: 'Criminal',
    title: 'Charge Sheet (Magistrate Court)',
    description: 'Charge before Magistrate.',
    jurisdiction: 'FCT, Abuja',
    court: 'Magistrate Court',
    content: `IN THE MAGISTRATE COURT OF THE FCT HOLDEN AT [LOCATION]

CHARGE NO: [SUIT NO]

THE COMMISSIONER OF POLICE
v.
[DEFENDANT NAME]

Charge: That you did [OFFENCE DESCRIPTION] contrary to [SECTION/LAW].`
  },

  {
    id: 'crim5',
    category: 'Criminal',
    title: 'Bail Bond',
    description: 'Bond by surety for the accused’s bail.',
    jurisdiction: 'Lagos State',
    court: 'Magistrate Court',
    content: `I, [SURETY NAME], of [ADDRESS], hereby undertake to be surety for [DEFENDANT NAME] admitted to bail in the sum of N[AMOUNT]. I shall ensure the Defendant attends court as required.

DATED THIS ...... DAY OF ...... 20....

__________________________
SURETY`
  },

  {
    id: 'prob4',
    category: 'Probate',
    title: 'Inventory of Estate Assets',
    description: 'List of assets filed in probate.',
    jurisdiction: 'Cross River State',
    court: 'High Court (Probate)',
    content: `INVENTORY OF ASSETS of the Estate of [DECEASED NAME]

1. Real Property: [ADDRESS]
2. Bank Accounts: [BANKS]
3. Motor Vehicles: [DETAILS]
4. Shares/Investments: [DETAILS]

DATED THIS ...... DAY OF ...... 20....

__________________________
EXECUTOR/ADMINISTRATOR`
  },

  {
    id: 'prob5',
    category: 'Probate',
    title: "Administrators' Bond",
    description: 'Bond undertaking proper administration of estate.',
    jurisdiction: 'Bayelsa State',
    court: 'High Court (Probate)',
    content: `We, [ADMINISTRATOR NAME] of [ADDRESS] and [SURETY NAME] of [ADDRESS], are jointly and severally bound unto the Probate Registrar in the sum of N[AMOUNT] for due administration of the estate of [DECEASED NAME].`
  },

  {
    id: 'prob6',
    category: 'Probate',
    title: 'Affidavit of Attesting Witness',
    description: 'Affidavit by witness to the Will.',
    jurisdiction: 'Akwa Ibom State',
    court: 'High Court (Probate)',
    content: `I, [WITNESS NAME], of [ADDRESS], state that I was present and saw [TESTATOR NAME] sign the Will dated [DATE] and that I signed as a witness in his/her presence.

SWORN TO at the Probate Registry, Akwa Ibom State this ...... day of ...... 20....

BEFORE ME
COMMISSIONER FOR OATHS`
  },

  {
    id: 'app4',
    category: 'Appellate',
    title: 'Motion for Stay of Execution',
    description: 'Stay of execution pending appeal.',
    jurisdiction: 'Enugu State',
    court: 'Court of Appeal, Enugu Division',
    content: `IN THE COURT OF APPEAL HOLDEN AT ENUGU

APPEAL NO: [SUIT NO]

MOTION ON NOTICE praying:
1. AN ORDER staying execution of the judgment delivered on [DATE] pending determination of the appeal.
2. AND FOR SUCH FURTHER ORDER(S) as the Court may deem fit.

DATED THIS ...... DAY OF ...... 20....

__________________________
COUNSEL`
  },

  {
    id: 'app5',
    category: 'Appellate',
    title: 'Notice of Cross Appeal',
    description: 'Respondent cross-appeals.',
    jurisdiction: 'Edo State',
    court: 'Court of Appeal, Benin Division',
    content: `IN THE COURT OF APPEAL HOLDEN AT BENIN

APPEAL NO: [SUIT NO]

NOTICE OF CROSS APPEAL

The Respondent cross-appeals against the judgment delivered on [DATE] on the following grounds: [GROUNDS].`
  },

  {
    id: 'fam5',
    category: 'Family',
    title: 'Petition for Dissolution of Marriage',
    description: 'Full petition under Matrimonial Causes Act.',
    jurisdiction: 'Imo State',
    court: 'High Court',
    content: `IN THE HIGH COURT OF IMO STATE HOLDEN AT [LOCATION]

SUIT NO: [SUIT NO]

BETWEEN:
[PLAINTIFF NAME]   ........................................   PETITIONER

AND
[DEFENDANT NAME]   ........................................   RESPONDENT

PETITION FOR DISSOLUTION OF MARRIAGE on grounds of irretrievable breakdown per Section 15 MCA.

RELIEFS: Decree Nisi; Custody; Maintenance.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'fam6',
    category: 'Family',
    title: 'Consent Terms',
    description: 'Agreed terms filed by parties.',
    jurisdiction: 'Osun State',
    court: 'High Court',
    content: `The parties hereby agree to the following consent terms:
1. Custody to the Petitioner.
2. Maintenance of N[AMOUNT] monthly.
3. Access arrangements as follows: [DETAILS].

DATED THIS ...... DAY OF ...... 20....

__________________________
PARTIES`
  },

  {
    id: 'nicn2',
    category: 'Corporate',
    title: 'Motion on Notice (NICN)',
    description: 'Interlocutory application at NICN.',
    jurisdiction: 'Federal',
    court: 'National Industrial Court of Nigeria, Lagos',
    content: `MOTION ON NOTICE praying:
1. AN ORDER directing payment of outstanding salaries.
2. AND FOR SUCH FURTHER ORDER(S) as the Court may deem fit.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'nicn3',
    category: 'Corporate',
    title: 'Statement of Facts (NICN)',
    description: 'Employee’s concise statement of facts in support of complaint.',
    jurisdiction: 'Federal',
    court: 'National Industrial Court of Nigeria, Port Harcourt',
    content: `STATEMENT OF FACTS

1. The Claimant was employed on [DATE] as [POSITION].
2. The Defendant terminated employment on [DATE] without due process.
3. The Claimant is owed salaries of N[AMOUNT].

RELIEFS: As per Complaint.`
  },
  {
    id: 'lit17',
    category: 'Civil Litigation',
    title: 'Final Written Address',
    description: 'Final argument submitted by counsel.',
    jurisdiction: 'Generic',
    court: 'High Court',
    content: `# [COURT]
# [DIVISION]
# HOLDEN AT [LOCATION]

SUIT NO: [SUIT NO]

BETWEEN:

[PLAINTIFF NAME]   ........................................   CLAIMANT

AND

[DEFENDANT NAME]   ........................................   DEFENDANT

## CLAIMANT'S FINAL WRITTEN ADDRESS

1.  **INTRODUCTION**
    This is the Final Written Address of the Claimant in this suit.

2.  **ISSUES FOR DETERMINATION**
    1.  Whether the Claimant has proved his case on the balance of probabilities.
    2.  Whether the Claimant is entitled to the reliefs sought.

3.  **ARGUMENT**
    Issue 1: ...
    Issue 2: ...

4.  **CONCLUSION**
    We urge the Court to grant the reliefs sought by the Claimant.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },
  {
    id: 'lit18',
    category: 'Civil Litigation',
    title: 'Statement of Defence and Counterclaim',
    description: 'Defendant’s pleading in response to a claim, with a counterclaim.',
    jurisdiction: 'Generic',
    court: 'High Court',
    content: `# [COURT]
# [DIVISION]
# HOLDEN AT [LOCATION]

SUIT NO: [SUIT NO]

BETWEEN:

[PLAINTIFF NAME]   ........................................   CLAIMANT

AND

[DEFENDANT NAME]   ........................................   DEFENDANT/COUNTER-CLAIMANT

## STATEMENT OF DEFENCE AND COUNTERCLAIM

**DEFENCE**
1.  The Defendant admits paragraph 1 of the Statement of Claim.
2.  The Defendant denies paragraphs 2, 3, and 4 of the Statement of Claim and puts the Claimant to the strictest proof thereof.
3.  The Defendant avers that...

**COUNTERCLAIM**
The Defendant/Counter-Claimant repeats paragraphs 1-3 of the Defence and claims against the Claimant as follows:
1.  A declaration that...
2.  The sum of N...

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },
  {
    id: 'lit19',
    category: 'Civil Litigation',
    title: 'Application for Bail (High Court)',
    description: 'Formal application for bail at the High Court.',
    jurisdiction: 'Generic',
    court: 'High Court',
    content: `# IN THE HIGH COURT OF [STATE]
# IN THE [JUDICIAL DIVISION]
# HOLDEN AT [LOCATION]

CHARGE NO: [CHARGE NO]

BETWEEN:

THE STATE   ........................................   COMPLAINANT

AND

[DEFENDANT NAME]   ........................................   DEFENDANT/APPLICANT

## MOTION ON NOTICE FOR BAIL

**BROUGHT PURSUANT TO SECTION [SECTION] OF THE ADMINISTRATION OF CRIMINAL JUSTICE LAW OF [STATE] 20[XX] AND THE INHERENT JURISDICTION OF THIS HONOURABLE COURT.**

**TAKE NOTICE** that this Honourable Court will be moved on the ... day of ..., 20... for:

1.  **AN ORDER** admitting the Defendant/Applicant to bail pending the hearing and determination of this charge.
2.  **AND FOR SUCH FURTHER ORDER(S)** as this Honourable Court may deem fit.

**GROUNDS FOR THE APPLICATION:**
1.  The offence is a bailable one.
2.  The Defendant/Applicant has credible sureties.
3.  The Defendant/Applicant will not jump bail.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },
  {
    id: 'lit20',
    category: 'Civil Litigation',
    title: 'Application for Enforcement of Fundamental Rights',
    description: 'Application for the enforcement of fundamental human rights.',
    jurisdiction: 'Federal',
    court: 'Federal High Court',
    content: `# IN THE FEDERAL HIGH COURT OF NIGERIA
# IN THE [JUDICIAL DIVISION]
# HOLDEN AT [LOCATION]

SUIT NO: [SUIT NO]

**IN THE MATTER OF AN APPLICATION BY [APPLICANT NAME] FOR THE ENFORCEMENT OF HIS FUNDAMENTAL RIGHTS**

BETWEEN:

[APPLICANT NAME]   ........................................   APPLICANT

AND

[RESPONDENT NAME]   ........................................   RESPONDENT

## ORIGINATING MOTION

**BROUGHT PURSUANT TO ORDER II OF THE FUNDAMENTAL RIGHTS (ENFORCEMENT PROCEDURE) RULES, 2009.**

**TAKE NOTICE** that this Honourable Court will be moved for the following reliefs:
1.  **A DECLARATION** that the arrest and detention of the Applicant is unconstitutional, null and void.
2.  **AN ORDER** for the immediate release of the Applicant.
3.  **N[AMOUNT]** as damages.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  // --- NEW PROPERTY LAW TEMPLATES ---
  {
    id: 'prop9',
    category: 'Property',
    title: 'Irrevocable Power of Attorney',
    description: 'Irrevocable power of attorney for property transactions.',
    jurisdiction: 'Generic',
    content: `**THIS IRREVOCABLE POWER OF ATTORNEY** is made this ...... day of ...... 20....

BY **[DONOR NAME]** of [DONOR ADDRESS] (the "Donor").

**NOW THIS DEED WITNESSES** as follows:
1.  The Donor hereby irrevocably appoints **[DONEE NAME]** of [DONEE ADDRESS] (the "Donee") to be his lawful attorney to do all or any of the following acts:
    a.  To sell, transfer, and assign the property at [PROPERTY ADDRESS].
    b.  To sign all documents necessary to effect the sale.
2.  This Power of Attorney is given for valuable consideration and shall be irrevocable.

**IN WITNESS WHEREOF** the Donor has executed this Deed.

__________________________
**DONOR**`
  },
  {
    id: 'prop10',
    category: 'Property',
    title: 'Hire Purchase Agreement',
    description: 'Agreement for the hire of goods with an option to purchase.',
    jurisdiction: 'Generic',
    content: `**HIRE PURCHASE AGREEMENT**

**PARTIES:**
1.  **[OWNER NAME]** (the "Owner")
2.  **[HIRER NAME]** (the "Hirer")

**GOODS:** [DESCRIPTION OF GOODS]

**TERMS:**
1.  The Hirer shall pay N[AMOUNT] per month for [NUMBER] months.
2.  The Hirer shall have the option to purchase the goods for N[AMOUNT] after the last payment.
3.  The goods remain the property of the Owner until the option to purchase is exercised.

DATED THIS ...... DAY OF ...... 20....

__________________________
**OWNER**

__________________________
**HIRER**`
  },
  {
    id: 'prop11',
    category: 'Property',
    title: 'Formal Contract of Sale of Land',
    description: 'A formal contract for the sale of land, including terms and conditions.',
    jurisdiction: 'Generic',
    content: `**CONTRACT OF SALE OF LAND**

**PARTIES:**
1.  **[VENDOR NAME]** (the "Vendor")
2.  **[PURCHASER NAME]** (the "Purchaser")

**PROPERTY:** [DESCRIPTION OF PROPERTY]

**PRICE:** N[AMOUNT]

**TERMS:**
1.  The Purchaser shall pay a deposit of N[AMOUNT] on the signing of this agreement.
2.  The balance shall be paid on or before [DATE].
3.  The Vendor shall deduce a good title to the property.

DATED THIS ...... DAY OF ...... 20....

__________________________
**VENDOR**

__________________________
**PURCHASER**`
  },
  {
    id: 'prop12',
    category: 'Property',
    title: 'Deed of Lease',
    description: 'A deed for the lease of property for a term of years.',
    jurisdiction: 'Generic',
    content: `**THIS DEED OF LEASE** is made this ...... day of ...... 20....

**BETWEEN**

**[LESSOR NAME]** of [ADDRESS] (the "Lessor")

**AND**

**[LESSEE NAME]** of [ADDRESS] (the "Lessee")

**NOW THIS DEED WITNESSES** as follows:
1.  The Lessor hereby demises to the Lessee ALL THAT [DESCRIPTION OF PROPERTY] for a term of [NUMBER] years.
2.  The Lessee shall pay a yearly rent of N[AMOUNT].

**IN WITNESS WHEREOF** the parties have executed this Deed.

__________________________
**LESSOR**

__________________________
**LESSEE**`
  },
  {
    id: 'prop13',
    category: 'Property',
    title: 'Deed of Mortgage',
    description: 'A deed creating a legal mortgage over a property.',
    jurisdiction: 'Generic',
    content: `**THIS DEED OF LEGAL MORTGAGE** is made this ...... day of ...... 20....

**BETWEEN**

**[MORTGAGOR NAME]** of [ADDRESS] (the "Mortgagor")

**AND**

**[MORTGAGEE NAME]** of [ADDRESS] (the "Mortgagee")

**NOW THIS DEED WITNESSES** as follows:
1.  The Mortgagor, in consideration of the sum of N[AMOUNT] advanced by the Mortgagee, hereby demises to the Mortgagee ALL THAT [DESCRIPTION OF PROPERTY].
2.  Provided that if the Mortgagor shall on [DATE] repay the said sum with interest, the term hereby created shall cease.

**IN WITNESS WHEREOF** the Mortgagor has executed this Deed.

__________________________
**MORTGAGOR**`
  },
  {
    id: 'prop14',
    category: 'Property',
    title: 'Will and Codicil',
    description: 'A template for a will and a codicil to amend it.',
    jurisdiction: 'Generic',
    content: `# LAST WILL AND TESTAMENT OF [TESTATOR NAME]

I, [TESTATOR NAME] of [ADDRESS], hereby revoke all former wills and declare this to be my last will.

1.  I appoint [EXECUTOR NAME] to be the executor of this my will.
2.  I give my property at [ADDRESS] to [BENEFICIARY NAME].

DATED THIS ...... DAY OF ...... 20....

__________________________
**TESTATOR**

---

# CODICIL TO THE WILL OF [TESTATOR NAME]

I, [TESTATOR NAME] of [ADDRESS], declare this to be a first codicil to my will dated [DATE OF WILL].

1.  I revoke the gift of my property at [ADDRESS] to [OLD BENEFICIARY NAME].
2.  I give the said property to [NEW BENEFICIARY NAME].

DATED THIS ...... DAY OF ...... 20....

__________________________
**TESTATOR**`
  },

  // --- NEW CORPORATE LAW TEMPLATES ---
  {
    id: 'corp6',
    category: 'Corporate',
    title: 'Partnership Agreement',
    description: 'An agreement to form a partnership.',
    jurisdiction: 'Generic',
    content: `**THIS PARTNERSHIP AGREEMENT** is made this ...... day of ...... 20....

**BETWEEN**

**[PARTNER 1 NAME]** of [ADDRESS]

**AND**

**[PARTNER 2 NAME]** of [ADDRESS]

**NOW IT IS HEREBY AGREED** as follows:
1.  The parties shall carry on the business of [BUSINESS DESCRIPTION] in partnership.
2.  The partnership shall commence on [DATE].
3.  The capital of the partnership shall be N[AMOUNT] contributed in equal shares.
4.  The net profits of the business shall be divided equally between the partners.

**IN WITNESS WHEREOF** the parties have executed this Agreement.

__________________________
**PARTNER 1**

__________________________
**PARTNER 2**`
  },
  {
    id: 'corp7',
    category: 'Corporate',
    title: 'Notice of General Meeting',
    description: 'Notice of an Annual General Meeting (AGM) or Extraordinary General Meeting (EGM).',
    jurisdiction: 'Generic',
    content: `**NOTICE OF ANNUAL/EXTRAORDINARY GENERAL MEETING OF [COMPANY NAME]**

**NOTICE IS HEREBY GIVEN** that the Annual/Extraordinary General Meeting of [COMPANY NAME] will be held at [LOCATION] on [DATE] at [TIME] for the following purposes:

**ORDINARY BUSINESS**
1.  To receive the Audited Financial Statements.
2.  To declare a dividend.
3.  To re-elect directors.

**SPECIAL BUSINESS**
1.  To consider and pass a special resolution to [RESOLUTION].

DATED THIS ...... DAY OF ...... 20....

BY ORDER OF THE BOARD

__________________________
**COMPANY SECRETARY**`
  },
  {
    id: 'corp8',
    category: 'Corporate',
    title: 'Notice of Board Meeting',
    description: 'Notice of a meeting of the Board of Directors.',
    jurisdiction: 'Generic',
    content: `**NOTICE OF A MEETING OF THE BOARD OF DIRECTORS OF [COMPANY NAME]**

**TO:** [DIRECTOR NAME]

**NOTICE IS HEREBY GIVEN** that a meeting of the Board of Directors will be held at [LOCATION] on [DATE] at [TIME].

**AGENDA**
1.  Minutes of the last meeting.
2.  Matters arising.
3.  [OTHER BUSINESS]
4.  Any other business.

DATED THIS ...... DAY OF ...... 20....

__________________________
**COMPANY SECRETARY**`
  },

  // --- NEW GENERAL LEGAL DOCUMENT TEMPLATES ---
  {
    id: 'gen1',
    category: 'General',
    title: 'Letter of Administration',
    description: 'Application for letters of administration for the estate of a deceased person.',
    jurisdiction: 'Generic',
    content: `# IN THE HIGH COURT OF [STATE]
# PROBATE DIVISION

IN THE ESTATE OF **[DECEASED NAME]** (DECEASED)

**PETITION FOR LETTERS OF ADMINISTRATION**

The petition of **[PETITIONER NAME]** of [ADDRESS] respectfully showeth:
1.  That the deceased died intestate on [DATE].
2.  That the petitioner is the [RELATIONSHIP] of the deceased.
3.  That the petitioner is entitled to a grant of letters of administration of the estate of the deceased.

Dated this ...... day of ...... 20....

__________________________
**PETITIONER**`
  },
  {
    id: 'gen2',
    category: 'General',
    title: 'Terms of Settlement',
    description: 'An agreement to settle a dispute out of court.',
    jurisdiction: 'Generic',
    content: `**TERMS OF SETTLEMENT**

**BETWEEN**

**[PARTY A NAME]**

**AND**

**[PARTY B NAME]**

The parties hereby agree to settle their dispute on the following terms:
1.  [PARTY B] shall pay [PARTY A] the sum of N[AMOUNT] in full and final settlement of all claims.
2.  This agreement shall be filed in court as a consent judgment.

DATED THIS ...... DAY OF ...... 20....

__________________________
**PARTY A**

__________________________
**PARTY B**`
  },
  {
    id: 'gen3',
    category: 'General',
    title: 'Bill of Charges',
    description: 'A bill of charges for legal services rendered.',
    jurisdiction: 'Generic',
    content: `# [YOUR LAW FIRM NAME]
[ADDRESS]
[DATE]

**BILL OF CHARGES**

**TO:** [CLIENT NAME]

**FOR PROFESSIONAL SERVICES RENDERED IN THE MATTER OF [MATTER NAME]**

| DATE       | PARTICULARS                      | AMOUNT (NGN) |
|------------|----------------------------------|--------------|
| [DATE]     | Initial Consultation             | [AMOUNT]     |
| [DATE]     | Filing of Writ of Summons        | [AMOUNT]     |
|            | **TOTAL**                        | **[TOTAL]**  |

__________________________
**[YOUR NAME]**`
  },
  {
    id: 'gen4',
    category: 'General',
    title: 'Client Agreement',
    description: 'An agreement between a lawyer and a client for legal services.',
    jurisdiction: 'Generic',
    content: `**CLIENT AGREEMENT**

**BETWEEN**

**[LAWYER/FIRM NAME]** (the "Lawyer")

**AND**

**[CLIENT NAME]** (the "Client")

**IT IS AGREED** as follows:
1.  The Lawyer shall provide legal services to the Client in respect of [MATTER].
2.  The Client shall pay the Lawyer a professional fee of N[AMOUNT].
3.  The Client shall be responsible for all disbursements.

DATED THIS ...... DAY OF ...... 20....

__________________________
**LAWYER**

__________________________
**CLIENT**`
  },
  {
    id: 'gen5',
    category: 'General',
    title: 'Subpoena',
    description: 'A writ ordering a person to attend a court.',
    jurisdiction: 'Generic',
    content: `# IN THE [COURT] OF [STATE]

SUIT NO: [SUIT NO]

**SUBPOENA AD TESTIFICANDUM / DUCES TECUM**

**TO:** [WITNESS NAME]

You are hereby commanded to appear in this court on [DATE] at [TIME] to testify in the above-named case.
(and to bring with you the following documents: [LIST OF DOCUMENTS])

DATED THIS ...... DAY OF ...... 20....

__________________________
**REGISTRAR**`
  },


  // --- NEW ADVANCED PROPERTY LAW TEMPLATES ---
  {
    id: 'prop15',
    category: 'Property',
    title: 'Abstract of Title',
    description: 'A chronological summary of the documents of title to a property.',
    jurisdiction: 'Generic',
    content: `**ABSTRACT OF TITLE**

**TO:** [PROPERTY ADDRESS]

1.  **[DATE]:** Deed of Assignment between **[PARTY A]** and **[PARTY B]**.
2.  **[DATE]:** Certificate of Occupancy No. [C of O No.] issued to **[PARTY B]**.
3.  **[DATE]:** Deed of Legal Mortgage between **[PARTY B]** and **[BANK NAME]**.

DATED THIS ...... DAY OF ...... 20....

__________________________
**[LAWYER NAME]**`
  },
  {
    id: 'prop16',
    category: 'Property',
    title: 'Epitome of Title',
    description: 'A schedule of documents of title to a property.',
    jurisdiction: 'Generic',
    content: `**EPITOME OF TITLE**

**TO:** [PROPERTY ADDRESS]

| DATE       | DOCUMENT                               | PARTIES                          |
|------------|----------------------------------------|----------------------------------|
| [DATE]     | Deed of Assignment                     | [PARTY A] and [PARTY B]          |
| [DATE]     | Certificate of Occupancy               | Governor of [STATE] and [PARTY B] |
| [DATE]     | Deed of Legal Mortgage                 | [PARTY B] and [BANK NAME]        |

DATED THIS ...... DAY OF ...... 20....

__________________________
**[LAWYER NAME]**`
  },

  // --- NEW ADVANCED CORPORATE LAW TEMPLATES ---
  {
    id: 'corp9',
    category: 'Corporate',
    title: 'Memorandum of Association',
    description: 'The memorandum of association of a company.',
    jurisdiction: 'Generic',
    content: `**MEMORANDUM OF ASSOCIATION**
**OF**
**[COMPANY NAME]**

1.  The name of the company is **[COMPANY NAME]**.
2.  The registered office of the company will be situated in Nigeria.
3.  The objects for which the company is established are: [LIST OF OBJECTS].
4.  The liability of the members is limited.
5.  The share capital of the company is N[AMOUNT] divided into [NUMBER] ordinary shares of N[VALUE] each.

We, the several persons whose names and addresses are subscribed, are desirous of being formed into a company, in pursuance of this memorandum of association, and we respectively agree to take the number of shares in the capital of the company set opposite our respective names.

| Names, Addresses, and Occupations of Subscribers | Number of shares taken by each Subscriber |
|----------------------------------------------------|-------------------------------------------|
| [SUBSCRIBER 1]                                     | [NUMBER]                                  |
| [SUBSCRIBER 2]                                     | [NUMBER]                                  |

DATED THIS ...... DAY OF ...... 20....`
  },
  {
    id: 'corp10',
    category: 'Corporate',
    title: 'Articles of Association',
    description: 'The articles of association of a company.',
    jurisdiction: 'Generic',
    content: `**ARTICLES OF ASSOCIATION**
**OF**
**[COMPANY NAME]**

1.  **PRELIMINARY**
    The regulations in Table A in the First Schedule to the Companies and Allied Matters Act, 2020 shall apply to the company.

2.  **SHARES**
    The rights and privileges attached to any class of shares may be varied with the consent in writing of the holders of three-fourths of the issued shares of that class.

3.  **DIRECTORS**
    The number of directors shall not be less than two.
    The first directors of the company shall be appointed in writing by the subscribers to the Memorandum of Association.

DATED THIS ...... DAY OF ...... 20....`
  },
  {
    id: 'fam7',
    category: 'Family',
    title: 'Adoption Petition',
    description: 'Petition for an Adoption Order.',
    jurisdiction: 'Generic',
    court: 'Family Court / High Court',
    content: `# IN THE FAMILY COURT OF [STATE]
# HOLDEN AT [LOCATION]

IN THE MATTER OF THE ADOPTION LAW OF [STATE]
AND
IN THE MATTER OF [CHILD'S NAME] (AN INFANT)

**PETITION FOR AN ADOPTION ORDER**

The Petition of **[PETITIONER 1 NAME]** and **[PETITIONER 2 NAME]** of [ADDRESS] showeth:

1. That the Petitioners are desirous of adopting the infant **[CHILD'S NAME]**.
2. That the Petitioners are [MARITAL STATUS] and have been resident in [STATE] for [NUMBER] years.
3. That the infant is of the [MALE/FEMALE] sex and was born on [DATE].
4. That the infant is in the care and possession of the Petitioners.

**PRAYER:**
The Petitioners pray that an Adoption Order be made in their favor in respect of the said infant.

DATED THIS ...... DAY OF ...... 20....

__________________________
**PETITIONERS**`
  },
  {
    id: 'fam8',
    category: 'Family',
    title: 'Affidavit of Marriage',
    description: 'Affidavit to prove existence of marriage.',
    jurisdiction: 'Generic',
    content: `I, [NAME], [SEX], [RELIGION], [OCCUPATION], of [ADDRESS], do hereby make Oath and state as follows:

1. That I am the Deponent herein and a citizen of Nigeria.
2. That I am lawfully married to [SPOUSE NAME] under [NATIVE LAW AND CUSTOM / MARRIAGE ACT].
3. That the marriage was celebrated on [DATE] at [LOCATION].
4. That the marriage is still subsisting.
5. That I swear to this Affidavit in good faith.

__________________________
**DEPONENT**

**SWORN TO** at the High Court Registry, [LOCATION].
This ...... day of ...... 20....

**BEFORE ME**

**COMMISSIONER FOR OATHS**`
  },
  {
    id: 'lit21',
    category: 'Civil Litigation',
    title: 'Writ of Execution (Fi.Fa)',
    description: 'Writ for attachment and sale of property to satisfy judgment.',
    jurisdiction: 'Generic',
    court: 'High Court',
    content: `# IN THE HIGH COURT OF [STATE]
# [DIVISION]
# HOLDEN AT [LOCATION]

SUIT NO: [SUIT NO]

**WRIT OF FIERI FACIAS (FI.FA)**

**TO THE SHERIFF:**

YOU ARE HEREBY COMMANDED that of the goods and chattels of **[JUDGMENT DEBTOR NAME]** in your division, you cause to be made the sum of N[AMOUNT] which **[JUDGMENT CREDITOR NAME]** lately in this court recovered against him.

AND in what manner you shall have executed this Writ, make appear to this Court immediately after the execution thereof.

DATED THIS ...... DAY OF ...... 20....

__________________________
**JUDGE / REGISTRAR**`
  },
  {
    id: 'corp11',
    category: 'Corporate',
    title: 'Share Transfer Form',
    description: 'Form for the transfer of shares between shareholders.',
    jurisdiction: 'Generic',
    content: `**SHARE TRANSFER FORM**

**NAME OF COMPANY:** [COMPANY NAME]

I, **[TRANSFEROR NAME]** of [ADDRESS], in consideration of the sum of N[AMOUNT] paid to me by **[TRANSFEREE NAME]** of [ADDRESS], (the "Transferee"), do hereby transfer to the Transferee [NUMBER] ordinary shares of N[VALUE] each in the above-named company.

TO HOLD the same unto the Transferee subject to the conditions on which I held the same immediately before the execution hereof.

**AS WITNESS** our hands this ...... day of ...... 20....

__________________________
**TRANSFEROR**

__________________________
**TRANSFEREE**`
  },
  {
    id: 'corp12',
    category: 'Corporate',
    title: 'Affidavit of Loss of Share Certificate',
    description: 'Affidavit to support application for duplicate share certificate.',
    jurisdiction: 'Generic',
    content: `I, [NAME], of [ADDRESS], do hereby make Oath and state as follows:

1. That I am a shareholder in [COMPANY NAME] holding [NUMBER] shares.
2. That Certificate No. [NUMBER] was issued to me in respect of the said shares.
3. That I have searched for the said certificate but cannot find same.
4. That the said certificate has been lost or mislaid.
5. That I make this Affidavit in support of an application for a duplicate certificate.

__________________________
**DEPONENT**

**SWORN TO** at the High Court Registry.
This ...... day of ...... 20....`
  },
  {
    id: 'prop17',
    category: 'Property',
    title: 'Surrender of Lease',
    description: 'Agreement to surrender a lease before expiry.',
    jurisdiction: 'Generic',
    content: `**DEED OF SURRENDER**

**BETWEEN**

**[LESSEE NAME]** (the "Lessee")

**AND**

**[LESSOR NAME]** (the "Lessor")

**WHEREAS:**
1. By a Lease dated [DATE], the Lessor demised the property at [ADDRESS] to the Lessee.
2. The parties have agreed to a surrender of the said Lease.

**NOW THIS DEED WITNESSES** that the Lessee hereby yields up and surrenders to the Lessor all the unexpired residue of the term granted by the Lease.

DATED THIS ...... DAY OF ...... 20....

__________________________
**LESSEE**`
  },
  {
    id: 'crim6',
    category: 'Criminal',
    title: 'Petition to Police (General)',
    description: 'Formal letter reporting a criminal offence to the Police.',
    jurisdiction: 'Generic',
    content: `[FIRM LETTERHEAD]

[DATE]

**THE COMMISSIONER OF POLICE,**
[STATE] COMMAND.

Dear Sir,

**PETITION AGAINST [NAME] FOR [OFFENCE]**

We act as Solicitors to **[CLIENT NAME]** ("our Client") on whose instruction we write.

Our Client instructs us that [DETAILED FACTS OF THE CRIME].

This act constitutes an offence of [OFFENCE] contrary to the [CRIMINAL/PENAL CODE].

We respectfully urge you to use your good offices to investigate this matter and bring the culprits to book.

Yours faithfully,

__________________________
**[LAWYER NAME]**`
  },
  {
    id: 'sc1',
    category: 'Appellate',
    title: 'Notice of Appeal (Supreme Court)',
    description: 'Appeal to the Supreme Court of Nigeria.',
    jurisdiction: 'Federal',
    court: 'Supreme Court of Nigeria',
    content: `IN THE SUPREME COURT OF NIGERIA HOLDEN AT ABUJA

SC. [NUMBER]

BETWEEN:

[APPELLANT NAME]   ........................................   APPELLANT

AND

[RESPONDENT NAME]   ........................................   RESPONDENT

NOTICE OF APPEAL against the judgment of the Court of Appeal delivered on [DATE] on the grounds: [GROUNDS].

DATED THIS ...... DAY OF ...... 20....

__________________________
COUNSEL`
  }
];

export const Precedents: React.FC<PrecedentsProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingTemplate, setViewingTemplate] = useState<Template | null>(null);
  const [copied, setCopied] = useState(false);
  const { saveDocumentToCase, cases, setActiveDoc } = useLegalStore();
  const [showUseModal, setShowUseModal] = useState(false);
  const [useCaseId, setUseCaseId] = useState('');
  const [useTitle, setUseTitle] = useState('');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('All');
  const [selectedCourt, setSelectedCourt] = useState<string>('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'library' | 'favorites' | 'recent'>('library');

  const categories = ['All', ...Array.from(new Set(TEMPLATES.map(t => t.category)))];
  const jurisdictions = ['All', ...Array.from(new Set(TEMPLATES.map(t => t.jurisdiction).filter(Boolean))) as string[]];
  const courts = ['All', ...Array.from(new Set(TEMPLATES.map(t => t.court).filter(Boolean))) as string[]];

  const filteredTemplates = TEMPLATES.filter(t => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesJurisdiction = (selectedJurisdiction === 'All') || (t.jurisdiction === selectedJurisdiction);
    const matchesCourt = (selectedCourt === 'All') || (t.court === selectedCourt);
    const matchesTab = activeTab === 'library' || (activeTab === 'favorites' && favorites.includes(t.id));
    return matchesCategory && matchesSearch && matchesJurisdiction && matchesCourt && matchesTab;
  });

  const handleCopy = () => {
    if (viewingTemplate) {
      navigator.clipboard.writeText(viewingTemplate.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUseTemplate = () => {
    if (!viewingTemplate) return;
    setUseTitle(`${viewingTemplate.title} - Draft`);
    setShowUseModal(true);
  };

  const confirmUseTemplate = () => {
    if (!viewingTemplate || !useCaseId || !useTitle) return;
    const newDocId = Date.now().toString();
    saveDocumentToCase(useCaseId, {
      id: newDocId,
      title: useTitle,
      content: viewingTemplate.content,
      type: 'Draft',
      createdAt: new Date()
    } as Omit<SavedDocument, 'status'>);
    setActiveDoc({ caseId: useCaseId, docId: newDocId });
    setShowUseModal(false);
    onNavigate(AppView.EDITOR);
  };

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-screen flex flex-col">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h2 className="text-3xl font-serif font-bold text-legal-900">Precedents Library</h2>
          <p className="text-gray-600 mt-2">Professional legal templates and court forms.</p>
        </div>
      </div>

      <div className="flex gap-6 mb-6 shrink-0 overflow-x-auto pb-2">
        <button 
          onClick={() => setActiveTab('library')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'library' ? 'bg-legal-900 text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}
        >
          <BookOpen size={18} /> Full Library
        </button>
        <button 
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'favorites' ? 'bg-legal-900 text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}
        >
          <Star size={18} fill={activeTab === 'favorites' ? "currentColor" : "none"} /> Favorites
        </button>
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* Sidebar Filters */}
        <div className="w-64 flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit overflow-y-auto max-h-full">
          <h3 className="font-bold text-legal-900 mb-4 px-2 uppercase tracking-widest text-[10px]">Filter by Category</h3>
          <div className="space-y-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-legal-50 text-legal-900 font-bold border-l-4 border-legal-gold' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="mt-8 space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 px-2 uppercase mb-2 tracking-widest">Jurisdiction</label>
              <select
                className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-legal-gold"
                value={selectedJurisdiction}
                onChange={e => setSelectedJurisdiction(e.target.value)}
              >
                {jurisdictions.map(j => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 px-2 uppercase mb-2 tracking-widest">Court Level</label>
              <select
                className="w-full border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-legal-gold"
                value={selectedCourt}
                onChange={e => setSelectedCourt(e.target.value)}
              >
                {courts.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Search Bar */}
          <div className="mb-6 relative shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, clause, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-legal-gold outline-none text-lg"
            />
          </div>

          {!viewingTemplate ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-2 pb-8">
              {filteredTemplates.length === 0 && (
                <div className="col-span-2 text-center text-gray-400 py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-10" />
                  <h4 className="text-lg font-bold">No precedents found</h4>
                  <p className="text-sm">Try adjusting your filters or search terms.</p>
                </div>
              )}
              {filteredTemplates.map(template => (
                <div 
                  key={template.id}
                  onClick={() => setViewingTemplate(template)}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-legal-gold cursor-pointer transition-all hover:shadow-xl group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-legal-gold opacity-[0.03] rounded-bl-full translate-x-8 -translate-y-8"></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-wider rounded-full">
                      {template.category}
                    </span>
                    <button 
                      onClick={(e) => toggleFavorite(e, template.id)}
                      className={`p-1.5 rounded-lg transition-colors ${favorites.includes(template.id) ? 'text-legal-gold bg-yellow-50' : 'text-gray-300 hover:text-legal-gold hover:bg-gray-50'}`}
                    >
                      <Star size={18} fill={favorites.includes(template.id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                  
                  <h3 className="font-serif font-bold text-legal-900 text-xl mb-2 group-hover:text-legal-gold transition-colors">{template.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">{template.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {template.jurisdiction && (
                      <span className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-legal-50 text-legal-800 border border-legal-100 rounded-lg uppercase tracking-tight">
                        <Scale size={10} /> {template.jurisdiction}
                      </span>
                    )}
                    {template.court && (
                      <span className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-gray-50 text-gray-600 border border-gray-200 rounded-lg uppercase tracking-tight">
                        <Gavel size={10} /> {template.court}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 flex-1 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setViewingTemplate(null)}
                    className="p-2 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-legal-900 transition-colors shadow-sm"
                  >
                    <ChevronRight className="rotate-180" size={20} />
                  </button>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-legal-gold">{viewingTemplate.category}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{viewingTemplate.jurisdiction || 'Federal'}</span>
                    </div>
                    <h3 className="font-serif font-bold text-legal-900 text-2xl">{viewingTemplate.title}</h3>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy Plain Text'}
                  </button>
                  <button
                    onClick={handleUseTemplate}
                    className="flex items-center gap-2 px-6 py-2.5 bg-legal-900 text-white rounded-xl text-sm font-black hover:bg-legal-800 transition-all shadow-lg shadow-legal-900/20"
                  >
                    <FileSignature className="w-5 h-5 text-legal-gold" />
                    Open in Editor
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-12 bg-slate-100/50">
                <div className="max-w-4xl mx-auto bg-white p-16 shadow-2xl rounded-sm min-h-full border border-gray-100 ring-1 ring-gray-200">
                  <div className="prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-legal-900">
                    <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed bg-transparent border-none p-0 select-all">
                      {viewingTemplate.content}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {showUseModal && viewingTemplate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-2xl text-legal-900 font-serif">Create Document</h3>
              <button onClick={() => setShowUseModal(false)} className="p-2 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Select Active Matter</label>
                <select 
                  className="w-full border border-gray-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-legal-gold bg-gray-50 text-legal-900 font-bold"
                  value={useCaseId}
                  onChange={e => setUseCaseId(e.target.value)}
                >
                  <option value="">-- Choose Case File --</option>
                  {cases.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
                {cases.length === 0 && <p className="text-xs text-red-500 mt-2 font-medium">! No active cases found. Create a case first.</p>}
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Draft Title</label>
                <input 
                  type="text"
                  className="w-full border border-gray-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-legal-gold bg-gray-50 text-legal-900 font-bold"
                  value={useTitle}
                  onChange={e => setUseTitle(e.target.value)}
                  placeholder={`e.g. ${viewingTemplate.title} - Draft 1`}
                />
              </div>
              <div className="flex gap-4 pt-2">
                <button onClick={() => setShowUseModal(false)} className="flex-1 px-4 py-4 text-sm font-bold text-gray-500 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors">Cancel</button>
                <button 
                  onClick={confirmUseTemplate}
                  disabled={!useCaseId || !useTitle}
                  className="flex-1 px-4 py-4 text-sm font-black text-white bg-legal-900 rounded-2xl hover:bg-legal-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-legal-900/20"
                >
                  Import Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const X = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
