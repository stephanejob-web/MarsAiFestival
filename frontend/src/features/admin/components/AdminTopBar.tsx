const AdminTopBar = (): React.JSX.Element => {
    return (
        <div className="flex h-2 w-full items-center gap-[10px] text-white">
            <span className="text-base text-white">Gestion des utilisateurs</span>
            <span className="text-xs text-zinc-400">Jury et Modération -- accès réservé</span>
        </div>
    );
};

export default AdminTopBar;
