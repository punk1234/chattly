import "./InfoMsg.css";

interface IProps { content: string; }

export function InfoMsg(props: IProps) {
  return (
    props.content ?
      <div className="InfoMsg">{ props.content }</div>
      :
      <></>
  )
}