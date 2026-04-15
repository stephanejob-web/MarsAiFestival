import React, { useState } from "react";
import { ExternalLink, Copy, Check, BarChart2, Database, AlertTriangle } from "lucide-react";

interface ServiceCardProps {
    icon: React.ReactNode;
    title: string;
    url: string;
    urlLabel?: string;
    credentials?: { label: string; value: string }[];
    note?: string;
}

function CopyButton({ value }: { value: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        void navigator.clipboard.writeText(value).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <button
            onClick={handleCopy}
            className="ml-2 rounded p-0.5 text-mist/50 transition-colors hover:text-aurora"
            title="Copier"
        >
            {copied ? <Check size={13} /> : <Copy size={13} />}
        </button>
    );
}

function ServiceCard({ icon, title, url, urlLabel, credentials, note }: ServiceCardProps) {
    return (
        <div className="rounded-xl border border-white/[0.07] bg-surface-2 p-6">
            <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-aurora/10 text-aurora">
                    {icon}
                </div>
                <h2 className="font-display text-[1rem] font-bold text-white-soft">{title}</h2>
            </div>

            <div className="mb-4">
                <p className="mb-1 text-[0.72rem] font-semibold uppercase tracking-widest text-mist/50">
                    URL
                </p>
                <div className="flex items-center gap-2">
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 truncate text-[0.85rem] text-aurora hover:underline"
                    >
                        {urlLabel ?? url}
                        <ExternalLink size={12} className="shrink-0" />
                    </a>
                    <CopyButton value={url} />
                </div>
            </div>

            {credentials && credentials.length > 0 && (
                <div className="mb-4">
                    <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-widest text-mist/50">
                        Identifiants
                    </p>
                    <div className="space-y-1.5 rounded-lg bg-surface-1/60 px-4 py-3">
                        {credentials.map(({ label, value }) => (
                            <div key={label} className="flex items-center justify-between gap-4">
                                <span className="text-[0.8rem] text-mist/60">{label}</span>
                                <div className="flex items-center">
                                    <code className="text-[0.82rem] font-mono text-white-soft">
                                        {value}
                                    </code>
                                    <CopyButton value={value} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {note && <p className="mt-3 text-[0.78rem] text-mist/50 italic">{note}</p>}
        </div>
    );
}

export default function AdminServicesPage(): React.JSX.Element {
    return (
        <div className="p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="font-display text-[1.4rem] font-extrabold tracking-[-0.02em] text-white-soft">
                    Services & accès
                </h1>
                <p className="mt-1 text-[0.85rem] text-mist/60">
                    URLs et identifiants des services tiers de la plateforme.
                </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                <ServiceCard
                    icon={<BarChart2 size={18} />}
                    title="Grafana"
                    url="https://marsai.lightchurch.fr/grafana"
                    credentials={[
                        { label: "Utilisateur", value: "admin" },
                        { label: "Mot de passe", value: "marsai_grafana_2026" },
                    ]}
                    note="Dashboard de monitoring — métriques base de données et système."
                />

                <ServiceCard
                    icon={<Database size={18} />}
                    title="MinIO — Console bucket"
                    url="http://51.254.131.39:9101"
                    credentials={[
                        { label: "Utilisateur", value: "minioadmin" },
                        { label: "Mot de passe", value: "minioadmin" },
                    ]}
                    note="Stockage objet S3-compatible. Accès console d'administration."
                />

                <ServiceCard
                    icon={<AlertTriangle size={18} />}
                    title="Sentry — DSN"
                    url="https://sentry.io"
                    urlLabel="sentry.io"
                    credentials={[
                        {
                            label: "DSN",
                            value: "https://cfbfbd20c080ca454c2ff20673625cf2@o4511194873004032.ingest.de.sentry.io/4511194905509968",
                        },
                    ]}
                    note="Surveillance des erreurs frontend et backend."
                />
            </div>
        </div>
    );
}
