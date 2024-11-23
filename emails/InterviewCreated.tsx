import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface InterviewNotificationEmailProps {
  interviewerName: string;
  intervieweeName: string;
  interviewRoomLink: string;
}

export const InterviewNotificationEmail = ({
  interviewerName = "Interviewer",
  intervieweeName = "Interviewee",
  interviewRoomLink = "https://example.com/interview-room",
}: InterviewNotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>
      {`Interview Scheduled: ${interviewerName} and ${intervieweeName}`}
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://img.icons8.com/?size=200&id=UHsdnYDHiIw2&format=png&color=000000"
          width="70"
          height="70"
          alt="async interview logo"
          style={logo}
        />
        <Text style={paragraph}>
          Hi {interviewerName} and {intervieweeName},
        </Text>
        <Text style={paragraph}>
          An interview has been scheduled, and you're both participants in this
          session. Please click the link below to join the interview room.
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={interviewRoomLink}>
            Join Interview Room
          </Button>
        </Section>
        <Text style={paragraph}>
          If you have any questions, feel free to reach out to us.
        </Text>
        <Text style={paragraph}>
          Best regards,
          <br />
          The Async Interview Team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          This email was sent to notify participants of a scheduled interview.
          If you did not request this, please ignore.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default InterviewNotificationEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#007BFF",
  borderRadius: "3px",
  color: "#ffffff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "10px 20px",
};

const hr = {
  borderColor: "#e0e0e0",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
