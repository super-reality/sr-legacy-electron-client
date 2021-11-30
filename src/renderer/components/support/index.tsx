import "./index.scss";
import { Router } from "@reach/router";
import Menu from "./support-menu";
import AskForHelp from "./support-help";
import StartHelp from "./support-help/getting-started";
import MainHelp from "./support-help/help";
import SupportTickets from "./support-tickets";
import SingleTicket from "./support-tickets/support-ticket";

export default function Support(): JSX.Element {
  return (
    <Router>
      <Menu path="/" />
      <AskForHelp path="ask">
        <StartHelp path="/" />
        <MainHelp path="help" />
      </AskForHelp>
      <SupportTickets path="give" />
      <SingleTicket path="give/:ticketId" />
    </Router>
  );
}
