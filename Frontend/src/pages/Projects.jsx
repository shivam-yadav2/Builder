import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "@/layout/Layout";
import {
  MapPin,
  Ruler,
  Building2,
  CalendarCheck,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  HardHat,
  ArrowUpRight,
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL;

const isVideo = (url) =>
  [".mp4", ".webm", ".ogg"].some((ext) => url?.toLowerCase().endsWith(ext));

const mediaUrl = (url) => `${API}/${url}`;

const Media = ({ url, alt, className }) =>
  isVideo(url) ? (
    <video src={mediaUrl(url)} className={className} muted autoPlay loop playsInline />
  ) : (
    <img src={mediaUrl(url)} alt={alt} className={className} />
  );

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null); // project open in lightbox
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    axios
      .get(`${API}/api/v1/gallery/get-all?category=construction`)
      .then((res) => setProjects(res.data?.data || []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [active]);

  const open = (project) => {
    setActive(project);
    setImgIndex(0);
  };
  const close = () => setActive(null);

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-600">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "28px 28px",
              }}
            />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-emerald-200 backdrop-blur">
              <HardHat className="h-4 w-4" />
              Our Construction Portfolio
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.1] text-white sm:text-5xl md:text-6xl">
              Projects we've <span className="text-emerald-400">built</span> from
              the ground up.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              A showcase of the homes, villas and commercial spaces we've
              designed and constructed — built to last, finished with care.
            </p>

            {projects.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
                <div>
                  <p className="text-3xl font-bold text-white">{projects.length}+</p>
                  <p className="text-sm text-white/60">Projects Completed</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">100%</p>
                  <p className="text-sm text-white/60">On-site Quality</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">A→Z</p>
                  <p className="text-sm text-white/60">End-to-end Build</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Grid */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse overflow-hidden rounded-3xl border">
                  <div className="h-60 bg-gray-100" />
                  <div className="space-y-3 p-5">
                    <div className="h-5 w-2/3 rounded bg-gray-100" />
                    <div className="h-4 w-1/2 rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                <Building2 className="h-9 w-9 text-emerald-500" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-gray-800">
                Projects coming soon
              </h3>
              <p className="mt-2 max-w-md text-gray-500">
                We're putting our latest construction projects together. Check
                back shortly to see our work.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-10 flex items-end justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Completed Projects</h2>
                  <p className="mt-1 text-gray-500">
                    {projects.length} {projects.length === 1 ? "project" : "projects"} delivered
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project, index) => (
                  <article
                    key={project._id}
                    onClick={() => open(project)}
                    className="group relative cursor-pointer overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl"
                    style={{ animation: `fadeUp 0.5s ease ${index * 70}ms both` }}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <Media
                        url={project.images?.[0]}
                        alt={project.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                      <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                        <CalendarCheck className="h-3 w-3" /> Completed
                      </span>

                      <div className="absolute right-4 top-4 flex h-10 w-10 translate-y-1 items-center justify-center rounded-full bg-white/95 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <ArrowUpRight className="h-5 w-5 text-gray-900" />
                      </div>

                      {/* Title over image */}
                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <h3 className="text-xl font-bold text-white drop-shadow">
                          {project.name}
                        </h3>
                        <p className="mt-1 flex items-center gap-1 text-sm text-white/85">
                          <MapPin className="h-3.5 w-3.5" /> {project.location}
                        </p>
                      </div>
                    </div>

                    {/* Meta footer */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-4 text-sm text-gray-600">
                      {project.project_type && (
                        <span className="flex items-center gap-1.5">
                          <Building2 className="h-4 w-4 text-emerald-500" />
                          {project.project_type}
                        </span>
                      )}
                      {project.area && (
                        <span className="flex items-center gap-1.5">
                          <Ruler className="h-4 w-4 text-emerald-500" />
                          {project.area}
                        </span>
                      )}
                      {project.completed_date && (
                        <span className="flex items-center gap-1.5">
                          <CalendarCheck className="h-4 w-4 text-emerald-500" />
                          {new Date(project.completed_date).getFullYear()}
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Lightbox */}
        {active && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={close}
          >
            <div
              className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b px-6 py-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{active.name}</h3>
                  <p className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="h-3.5 w-3.5" /> {active.location}
                  </p>
                </div>
                <button
                  onClick={close}
                  className="rounded-full p-2 transition-colors hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid gap-6 overflow-y-auto p-6 md:grid-cols-2 md:max-h-[calc(92vh-80px)]">
                {/* Media */}
                <div>
                  <div className="relative overflow-hidden rounded-2xl bg-gray-100">
                    <Media
                      url={active.images?.[imgIndex]}
                      alt={active.name}
                      className="h-72 w-full object-cover sm:h-80"
                    />
                    {active.images?.length > 1 && (
                      <>
                        <button
                          onClick={() => setImgIndex((i) => Math.max(0, i - 1))}
                          disabled={imgIndex === 0}
                          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow disabled:opacity-40"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setImgIndex((i) => Math.min(active.images.length - 1, i + 1))}
                          disabled={imgIndex === active.images.length - 1}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow disabled:opacity-40"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                  {active.images?.length > 1 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto">
                      {active.images.map((media, i) => (
                        <button
                          key={i}
                          onClick={() => setImgIndex(i)}
                          className={`h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                            i === imgIndex ? "border-emerald-500" : "border-transparent opacity-70"
                          }`}
                        >
                          <Media url={media} alt="" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {active.project_type && (
                      <div className="rounded-xl border bg-gray-50 p-3">
                        <p className="text-xs uppercase tracking-wide text-gray-400">Type</p>
                        <p className="font-semibold text-gray-800">{active.project_type}</p>
                      </div>
                    )}
                    {active.area && (
                      <div className="rounded-xl border bg-gray-50 p-3">
                        <p className="text-xs uppercase tracking-wide text-gray-400">Area</p>
                        <p className="font-semibold text-gray-800">{active.area}</p>
                      </div>
                    )}
                    {active.completed_date && (
                      <div className="rounded-xl border bg-gray-50 p-3">
                        <p className="text-xs uppercase tracking-wide text-gray-400">Completed</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(active.completed_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {active.description && (
                    <div>
                      <h4 className="mb-1 text-sm font-semibold text-gray-900">About this project</h4>
                      <p className="text-sm leading-relaxed text-gray-600">{active.description}</p>
                    </div>
                  )}

                  {active.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {active.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default Projects;
