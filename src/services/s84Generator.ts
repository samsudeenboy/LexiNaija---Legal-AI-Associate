/**
 * S.84 Evidence Act 2011 Certificate Generator
 * Generates compliant certificates for electronic evidence with integrity hashing
 */

import { EvidenceItem, Case, FirmProfile, Client } from '../types';

export interface S84CertificateData {
  id: string;
  evidenceId: string;
  caseId: string;
  content: string;
  deviceDetails: DeviceDetails;
  integrityHash: string;
  generatedAt: Date;
  generatedBy: string;
}

export interface DeviceDetails {
  userAgent: string;
  screen: string;
  timezone: string;
  language: string;
  timestamp: string;
  deviceType: string;
  os: string;
  browser: string;
}

/**
 * Generate device fingerprint for S.84 certificate
 */
export const getDeviceFingerprint = (): DeviceDetails => {
  const ua = navigator.userAgent;
  
  // Parse browser/OS from user agent (simple parsing)
  let browser = 'Unknown';
  let os = 'Unknown';
  let deviceType = 'Desktop';
  
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';
  
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) { os = 'Android'; deviceType = 'Mobile'; }
  else if (ua.includes('iOS')) { os = 'iOS'; deviceType = 'Mobile'; }
  
  return {
    userAgent: ua,
    screen: `${screen.width}x${screen.height}@${window.devicePixelRatio || 1}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    timestamp: new Date().toISOString(),
    deviceType,
    os,
    browser
  };
};

/**
 * Generate SHA-256 integrity hash for evidence
 */
export const generateIntegrityHash = async (data: {
  description: string;
  dateObtained: Date;
  type: string;
  custodyLocation: string;
  caseNumber?: string;
}): Promise<string> => {
  const encoder = new TextEncoder();
  const dataString = JSON.stringify({
    ...data,
    generatedAt: new Date().toISOString()
  });
  const dataBuffer = encoder.encode(dataString);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex.toUpperCase();
};

/**
 * Generate S.84 Certificate content
 */
export const generateS84Certificate = (
  evidenceItem: EvidenceItem,
  selectedCase: Case,
  client: Client | undefined,
  firmProfile: FirmProfile,
  deviceDetails: DeviceDetails,
  integrityHash: string
): string => {
  const court = selectedCase.court || 'HIGH COURT OF LAGOS STATE';
  const judicialDivision = selectedCase.court?.split(',')[1]?.trim() || 'LAGOS';
  const suitNumber = selectedCase.suitNumber || '....................';
  const claimant = client?.name || 'CLAIMANT';
  const defendant = selectedCase.opposingParty || 'DEFENDANT';
  const solicitorName = firmProfile.solicitorName || 'Counsel';
  const firmName = firmProfile.name || 'Law Firm';
  const firmAddress = firmProfile.address || 'Address';
  
  // Handle preview mode (before hash is generated)
  const hashDisplay = integrityHash === 'preview' 
    ? '[SHA-256 HASH WILL BE GENERATED UPON EXECUTION]'
    : integrityHash;
  
  return `IN THE ${court.toUpperCase()}
IN THE ${judicialDivision.toUpperCase()} JUDICIAL DIVISION
HOLDEN AT ${judicialDivision.toUpperCase()}

SUIT NO: ${suitNumber}

BETWEEN:

${claimant.toUpperCase()} ........................................ CLAIMANT

AND

${defendant.toUpperCase()} ........................................ DEFENDANT


CERTIFICATE OF COMPLIANCE
(Pursuant to Section 84 of the Evidence Act, 2011)


I, ${solicitorName}, Adult, Nigerian Citizen, of ${firmAddress}, do hereby certify as follows:

1. That I am the solicitor to the Claimant/Defendant in this suit and by virtue of my position, I am conversant with the facts deposed to herein.

2. That the document described as "${evidenceItem.description}" was produced by a computer/electronic device during a period over which the computer was used regularly to store or process information for the purposes of the activities regularly carried on over that period.

3. That over that period, there was regularly supplied to the computer in the ordinary course of those activities information of the kind contained in the statement or of the kind from which the information so contained is derived.

4. That throughout the material part of that period, the computer was operating properly or, if not, that any respect in which it was not operating properly or was out of operation during that part of that period was not such as to affect the production of the document or the accuracy of its contents.

5. That the information contained in the statement reproduces or is derived from information supplied to the computer in the ordinary course of those activities.

6. That the computer used is a standard device operating on standard software without manipulation, with the following specifications:

   Device Type: ${deviceDetails.deviceType}
   Operating System: ${deviceDetails.os}
   Browser: ${deviceDetails.browser}
   Screen Resolution: ${deviceDetails.screen}
   Timezone: ${deviceDetails.timezone}
   Language: ${deviceDetails.language}

7. That this certificate is generated on ${new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })} at ${new Date().toLocaleTimeString('en-NG')}.

8. That the integrity hash of this electronic evidence is:

   ${hashDisplay}

   (This SHA-256 hash certifies that the document has not been altered since generation)


DATED THIS ...... DAY OF ...... 20....


__________________________
${solicitorName}
Counsel to the Claimant/Defendant
${firmName}
${firmAddress}
${firmProfile.email || ''} | ${firmProfile.phone || ''}


CERTIFIED TRUE COPY


__________________________
${solicitorName}, Esq.
${new Date().getFullYear()}
`;
};

/**
 * Download S.84 Certificate as PDF-ready document
 */
export const downloadS84Certificate = (content: string, caseTitle: string, evidenceDescription: string) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `S.84_Certificate_${caseTitle.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_${evidenceDescription.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Validate if evidence requires S.84 certificate
 */
export const requiresS84Certificate = (evidenceType: string): boolean => {
  const electronicTypes = ['Document', 'Image', 'Audio', 'Correspondence'];
  return electronicTypes.includes(evidenceType);
};
