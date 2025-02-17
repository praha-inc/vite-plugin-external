import { findUp } from 'find-up';

export const findPackageJsonPath = async (cwd?: string): Promise<string | undefined> => {
  if (cwd) {
    return await findUp('package.json', { type: 'file', cwd });
  }
  return await findUp('package.json', { type: 'file' });
};
