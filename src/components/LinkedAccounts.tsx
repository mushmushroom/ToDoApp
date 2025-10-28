import { FaGithub, FaGoogle } from 'react-icons/fa';

type LinkedAccountsProps = {
  providers: string[];
};

export default function LinkedAccounts({ providers }: LinkedAccountsProps) {
  const availableProviders = [
    { id: 'google', name: 'Google', icon: <FaGoogle size={28} /> },
    { id: 'github', name: 'GitHub', icon: <FaGithub size={28} /> },
  ];
  const linkedProviders = availableProviders.filter((p) => providers.includes(p.id));

  if (linkedProviders.length === 0) return null;

  return (
    <>
      <h2 className="mb-4 font-bold text-3xl text-primary p-0">Linked Accounts</h2>
      <div className="flex flex-col gap-3 max-w-lg">
        {linkedProviders.map((p) => {
          return (
            <div
              key={p.id}
              className="flex items-center gap-3 p-3 rounded-md border border-green-400 bg-green-50 text-green-700"
            >
              {p.icon}
              <span className="font-medium">{p.name}</span>
              <span className="ml-auto text-sm text-green-600">Connected</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
