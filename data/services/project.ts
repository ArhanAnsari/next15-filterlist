import 'server-only';

import { cookies } from 'next/headers';
import { prisma } from '@/db';

export async function getProject() {
  console.log('getProject');

  await cookies();

  const projects = await prisma.project.findMany({
    include: {
      teamMembers: true,
    },
  });

  const project = projects.map(proj => {
    return {
      ...proj,
      teamMembers: proj.teamMembers.reduce(
        (acc, member) => {
          if (!acc[member.role]) {
            acc[member.role] = { count: 0, members: [] };
          }
          acc[member.role].count += 1;
          acc[member.role].members.push(member);
          return acc;
        },
        {} as Record<string, { count: number; members: typeof proj.teamMembers }>,
      ),
    };
  });

  return project[0];
}
