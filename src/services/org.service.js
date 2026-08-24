const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');

async function listMembers({ orgId }) {
  const members = await prisma.orgMember.findMany({
    where: { orgId },
    include: { user: { select: { id: true, email: true, name: true } } },
    orderBy: { createdAt: 'asc' },
  });

  return members.map((m) => ({
    userId: m.user.id,
    email: m.user.email,
    name: m.user.name,
    role: m.role,
    joinedAt: m.createdAt,
  }));
}

async function addMember({ orgId, email, role }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw AppError.notFound(
      'No registered user with this email. They must register first.',
      'USER_NOT_FOUND'
    );
  }

  const existing = await prisma.orgMember.findUnique({
    where: { orgId_userId: { orgId, userId: user.id } },
  });
  if (existing) {
    throw AppError.conflict('User is already a member of this organization', 'ALREADY_MEMBER');
  }

  const membership = await prisma.orgMember.create({ data: { orgId, userId: user.id, role } });
  return { userId: user.id, email: user.email, name: user.name, role: membership.role };
}

async function updateMemberRole({ orgId, userId, role }) {
  const membership = await prisma.orgMember.findUnique({
    where: { orgId_userId: { orgId, userId } },
  });
  if (!membership) throw AppError.notFound('Member not found', 'MEMBER_NOT_FOUND');

  const updated = await prisma.orgMember.update({
    where: { orgId_userId: { orgId, userId } },
    data: { role },
  });
  return { userId, role: updated.role };
}

async function removeMember({ orgId, userId }) {
  const result = await prisma.orgMember.deleteMany({ where: { orgId, userId } });
  if (result.count === 0) throw AppError.notFound('Member not found', 'MEMBER_NOT_FOUND');
}

module.exports = { listMembers, addMember, updateMemberRole, removeMember };
