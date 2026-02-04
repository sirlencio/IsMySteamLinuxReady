import {
  ShieldCheckIcon,
  CommandLineIcon,
  QuestionMarkCircleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Link } from "react-router";

const faqs = [
  {
    question: "How do I make my Steam library public?",
    answer:
      "Go to your Steam Profile > Edit Profile > Privacy Settings. Set 'My profile' and 'Game details' to Public. Uncheck the box that hides your playtime if you want accurate sorting!",
  },
  {
    question: "Where does the compatibility data come from?",
    answer:
      "I aggregate data from ProtonDB and Steam's official Linux support metadata. ProtonDB is a community-driven database where thousands of Linux gamers report how games run.",
  },
  {
    question: "What does 'Very Compatible' actually mean?",
    answer:
      "These are games with Native Linux support or a 'Platinum' rating on ProtonDB. They usually run as good as, or better than, on Windows without any manual configuration.",
  },
  {
    question: "Is my Steam data safe?",
    answer:
      "I only use your public SteamID to fetch publicly available data. We don't require your password, nor do I store any personal information.",
  },
];

const AboutPage = () => {
  return (
    <div className="flex flex-col items-center px-6 py-16 md:py-24 space-y-24 max-w-4xl mx-auto min-h-screen">
      <section className="text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
          The Mission
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
          Escaping the <span className="text-indigo-500">Windows</span> Era.
        </h1>
        <div className="space-y-6 text-gray-400 text-lg leading-relaxed text-pretty">
          <p>
            Windows used to be the default for gaming, but the increasing
            clutter, telemetry, and forced updates have turned the OS into a
            product that serves its creator more than its user.
          </p>
          <p>
            The birth of the{" "}
            <span className="text-white font-medium text-base">Steam Deck</span>{" "}
            and the massive improvements in{" "}
            <span className="text-white font-medium text-base">Proton</span>{" "}
            have made Linux a viable, high-performance alternative. This project
            was born to help gamers transition by showing them that their
            library is already ready for the move.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-2 transition-colors hover:border-indigo-500/30">
            <CommandLineIcon className="size-6 text-indigo-400" />
            <h3 className="text-white font-bold">Open Source Spirit</h3>
            <p className="text-sm">
              Built with transparency in mind, just like the Linux ecosystem
              itself.
            </p>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-2 transition-colors hover:border-green-500/30">
            <ShieldCheckIcon className="size-6 text-green-400" />
            <h3 className="text-white font-bold">Privacy First</h3>
            <p className="text-sm">
              No trackers, no login required. Just your public profile,
              analyzed.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full space-y-12">
        <div className="text-center space-y-4">
          <QuestionMarkCircleIcon className="size-12 text-gray-600 mx-auto" />
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Disclosure
              key={index}
              as="div"
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
            >
              <DisclosureButton className="group flex w-full items-center justify-between p-6 text-left transition hover:bg-white/5">
                <span className="text-lg font-medium text-white/90">
                  {faq.question}
                </span>
                <ChevronDownIcon className="size-5 text-gray-500 group-data-open:rotate-180 transition-transform" />
              </DisclosureButton>
              <DisclosurePanel className="px-6 pb-6 text-gray-400 text-sm leading-relaxed">
                {faq.answer}
              </DisclosurePanel>
            </Disclosure>
          ))}
        </div>
      </section>

      <section className="w-full p-8 bg-indigo-500/5 border border-indigo-500/20 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-white font-bold text-xl">
            Want to see how it works?
          </h3>
          <p className="text-gray-400 text-sm">
            This project is open source. Feel free to explore the code or
            contribute.
          </p>
        </div>
        <a
          href="https://github.com/TU_USUARIO/TU_REPO"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
        >
          <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          View on GitHub
        </a>
      </section>

      <section className="w-full pt-12 border-t border-white/5 flex flex-col items-center space-y-6">
        <p className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500">
          Powered by community data from
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12">
          <Link
            to="https://www.protondb.com/"
            target="_blank"
            rel="noreferrer"
            className="grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
          >
            <img
              src="https://www.protondb.com/sites/protondb/images/site-logo.svg"
              alt="ProtonDB"
              className="h-8 md:h-10"
            />
          </Link>
          <Link
            to="https://www.steamgriddb.com/"
            target="_blank"
            rel="noreferrer"
            className="grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
          >
            <img
              src="https://www.steamgriddb.com/static/img/logo.svg"
              alt="SteamGridDB"
              className="h-8 md:h-10"
            />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
