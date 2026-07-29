'use client';

import Stack from '@mui/material/Stack';
import { PhoneField } from '@/components/pages-modules/PhoneField';
import type { ContactPageSettings } from '@/types/pagesModules';

interface SectionProps {
  settings: ContactPageSettings;
  onChange: (patch: Partial<ContactPageSettings>) => void;
}

export function TelephoneContactSection({ settings, onChange }: SectionProps) {
  return (
    <Stack spacing={2.5}>
      <PhoneField
        id="contact-settings-field-phone1"
        label="Téléphone 1"
        country={settings.phone1Country}
        number={settings.phone1}
        onCountryChange={(phone1Country) => onChange({ phone1Country })}
        onNumberChange={(phone1) => onChange({ phone1 })}
      />
      <PhoneField
        id="contact-settings-field-phone2"
        label="Téléphone 2"
        country={settings.phone2Country}
        number={settings.phone2}
        onCountryChange={(phone2Country) => onChange({ phone2Country })}
        onNumberChange={(phone2) => onChange({ phone2 })}
      />
      <PhoneField
        id="contact-settings-field-phone3"
        label="Téléphone 3"
        country={settings.phone3Country}
        number={settings.phone3}
        onCountryChange={(phone3Country) => onChange({ phone3Country })}
        onNumberChange={(phone3) => onChange({ phone3 })}
      />
    </Stack>
  );
}
