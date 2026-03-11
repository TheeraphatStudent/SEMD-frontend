'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Pulse, SectionHeader, Container } from '@/components/ui';
import { URLTablePreview } from '@/components/auth/URLTablePreview';

const LiveDot: React.FC = () => (
  <Pulse size="sm" variant="success" />
);

export const DemoTableSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} id="demo" className="py-20 bg-background">
      <Container size="xl">
        <SectionHeader
          badge={
            <span className="inline-flex items-center gap-2">
              <LiveDot />
              Live Preview
            </span>
          }
          title="ดูตัวอย่างรายงาน URL จริง"
          description="วางเมาส์เพื่อดูรายละเอียด · คลิกแถวเพื่อขยายข้อมูล · กรองตามผลลัพธ์"
          align="center"
          animated={isInView}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9"
        >
          <URLTablePreview
            variant="full"
            maxHeight="320px"
            showBrowserBar={true}
            showToolbar={true}
            showPagination={true}
            showFilters={true}
            animated={true}
          />
        </motion.div>
      </Container>
    </section>
  );
};
