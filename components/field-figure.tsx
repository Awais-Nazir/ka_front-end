import { FileText } from 'lucide-react'

export function FieldFigure() {
  return <figure className="field-figure" aria-label="Example of an answer citing a page in Alpine field notes">
    <div className="figure-meta"><span>DOCUMENT STUDY</span><span>FIG. 01</span></div>
    <div className="paper-stack" aria-hidden="true">
      <div className="back-sheet" />
      <div className="report">
        <div className="report-kicker">FIELDWORK SERIES <span>VOL. 04</span></div>
        <div className="report-title">Alpine<br/>field notes.</div>
        <div className="report-sub">A topographic survey of the northern ridge</div>
        <img src="/ridge-study.svg" alt="" className="ridge" />
        <div className="report-foot"><span>PLATE IV</span><span>46°31′ N &nbsp; 10°27′ E</span></div>
      </div>
    </div>
    <div className="excerpt">
      <div className="excerpt-label"><i/> SOURCE EXCERPT</div>
      <p>“The northern ridge records the greatest change in elevation.”</p>
      <div className="excerpt-cite"><FileText size={13}/> Alpine field notes <span>·</span> p. 12</div>
    </div>
    <figcaption><span>FIELD NOTES</span><i/> RESEARCH COLLECTION</figcaption>
  </figure>
}

