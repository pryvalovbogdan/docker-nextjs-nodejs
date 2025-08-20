import { emeraldHtmlStyles } from '@/entities/category/utils/consts';
import { Box } from '@chakra-ui/react';

const CategoryDescription = ({
  html,
  variant = 'full',
  mt = 6,
  lines = 8,
}: {
  html: string;
  variant?: 'full' | 'short';
  mt?: number | string;
  lines?: number;
}) => {
  const cls = variant === 'short' ? 'emerald-html eh-short' : 'emerald-html eh-full';

  return (
    <Box
      mt={mt}
      dangerouslySetInnerHTML={{
        __html: `
          <style>${emeraldHtmlStyles}</style>
          <div class="${cls}" style="--eh-lines:${lines}">
            <div class="eh-body">
              ${html}
            </div>
          </div>
        `,
      }}
    />
  );
};

export default CategoryDescription;
