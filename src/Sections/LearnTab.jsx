import { Link } from "react-router-dom";
import Icon from "../Components/Icon";

const TRACKS = [
  { id: 1, t: "Arrays 101", d: "Warm up with the foundations of indexing, iteration, and basic patterns.", prog: 100, items: 17 },
  { id: 2, t: "Two Pointers", d: "Master the sliding & converging pointer patterns on arrays and strings.", prog: 80, items: 12 },
  { id: 3, t: "Binary Search", d: "From classic midpoint to answer-space search and monotonic predicates.", prog: 66, items: 14 },
  { id: 4, t: "Linked List", d: "Reverse, detect, merge. The moves you reach for on every interview day.", prog: 40, items: 10 },
  { id: 5, t: "Binary Tree", d: "Traversals, recursion, and tree DP — the whole picture in one track.", prog: 20, items: 16 },
  { id: 6, t: "Heap & Priority Queue", d: "Top-K, K-way merge, median streams. Use the right tool faster.", prog: 0, items: 9 },
  { id: 7, t: "Hash Table", d: "Count, index, deduplicate. The unsung hero of real-world engineering.", prog: 0, items: 8 },
  { id: 8, t: "Sliding Window", d: "Longest / shortest substrings, subarray sums — the templatized family.", prog: 0, items: 11 },
  { id: 9, t: "Dynamic Programming I", d: "Memoization, tabulation, 1-D state. Build intuition first, not formulas.", prog: 0, items: 15 },
  { id: 10, t: "Graph Fundamentals", d: "BFS, DFS, connected components, topological sort — done right.", prog: 0, items: 13 },
  { id: 11, t: "Recursion I", d: "The mental model, then the paradigms: divide, backtrack, conquer.", prog: 0, items: 10 },
  { id: 12, t: "Bit Manipulation", d: "XOR tricks, subsets, packing — from party tricks to production code.", prog: 0, items: 9 },
];

/* Four steps along the cyan → lemon axis, at roughly half the old intensity.
   There were six gradients, and three of them spent the app's difficulty colours
   — mint, rose, amber — on decoration, so a learner could read "easy" off a
   Binary Search header and "hard" off a Binary Tree one. A fourth was a violet
   the token set doesn't contain. Twelve cards over four steps still gives the
   grid a rhythm; it just stops saying something it doesn't mean.
   Three, not four: the grid is four columns wide, so four gradients gave every
   column a single colour and made the columns look like they meant something.
   Three cycles diagonally across the rows. */
const GRADIENTS = [
  "rgba(34,211,238,0.30) 0%, rgba(8,145,178,0.14) 100%",
  "rgba(165,243,252,0.22) 0%, rgba(34,211,238,0.11) 100%",
  "rgba(255,225,64,0.26) 0%, rgba(217,184,0,0.13) 100%",
];

export default function LearnTab() {
  return (
    <div className="cl-container" style={{ paddingBottom: 40 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {TRACKS.map((c, i) => <TrackCard key={c.id} c={c} grad={GRADIENTS[i % GRADIENTS.length]} />)}
      </div>
    </div>
  );
}

const TrackCard = ({ c, grad }) => (
  <Link to="#" className="cl-card cl-learn-card" style={{ padding: 0, overflow: "hidden", textDecoration: "none", color: "inherit" }}>
    <div style={{ height: 90, background: `linear-gradient(135deg, ${grad})`, position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent, rgba(7,8,12,.85))" }} />
      {/* These numbers stay. The tracks are a curriculum — Arrays before Two
          Pointers before Binary Search — so the order is information a beginner
          needs, which is the case the numbered-marker ban carves out. Only the
          shouting goes: .15em tracking and full caps down to a plain label. */}
      <div className="cl-mono" style={{ position: "absolute", top: 12, left: 14, fontSize: 10.5, color: "rgba(255,255,255,.85)", letterSpacing: ".04em" }}>
        Track {String(c.id).padStart(2, "0")}
      </div>
      <div className="cl-mono" style={{ position: "absolute", top: 12, right: 14, fontSize: 10.5, color: "rgba(255,255,255,.75)" }}>
        {c.items} problems
      </div>
    </div>
    <div style={{ padding: "18px 20px" }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>{c.t}</div>
      <p className="cl-text-dim" style={{ fontSize: 12.5, lineHeight: 1.5, marginTop: 15, marginBottom: 15 }}>{c.d}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div className="cl-bar" style={{ flex: 1 }}><div className="cl-bar-fill" style={{ width: `${c.prog}%` }} /></div>
        <span className="cl-mono" style={{ fontSize: 10, color: c.prog === 100 ? "var(--easy)" : "var(--text-mute)" }}>
          {c.prog === 100 ? "✓ complete" : `${c.prog}%`}
        </span>
      </div>
    </div>
  </Link>
);
