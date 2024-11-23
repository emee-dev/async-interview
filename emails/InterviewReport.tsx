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

interface PostInterviewReportEmailProps {
  interviewerName: string;
  intervieweeName: string;
  reportLink: string;
}

export const PostInterviewReportEmail = ({
  interviewerName = "Interviewer",
  intervieweeName = "Interviewee",
  reportLink = "https://example.com/post-interview-report",
}: PostInterviewReportEmailProps) => (
  <Html>
    <Head />
    <Preview>
      {`Post-Interview Report Available: ${interviewerName} and ${intervieweeName}`}
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
          The post-interview report for your recent session is now available.
          This report includes the video recording, transcripts, and an
          AI-generated summary of the discussion.
        </Text>
        <Text style={paragraph}>
          Click the button below to access the report.
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={reportLink}>
            View Post-Interview Report
          </Button>
        </Section>
        <Text style={paragraph}>
          If you have any questions or need assistance, feel free to reach out
          to our support team.
        </Text>
        <Text style={paragraph}>
          Best regards,
          <br />
          The Async Interview Team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          This email was sent to notify you about the availability of your
          post-interview report. If you did not participate in this interview,
          please ignore.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default PostInterviewReportEmail;

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
