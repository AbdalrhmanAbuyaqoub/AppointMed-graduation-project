import { Title, Text, Button, Container, Group, Stack } from "@mantine/core";
import { IconBrandMantine } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import classes from "../styles/Landing.module.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className={classes.wrapper}>
      <Container size="lg">
        <div className={classes.header}>
          <Group className={classes.logo}>
            <IconBrandMantine
              size={42}
              stroke={1.5}
              color="var(--mantine-color-blue-filled)"
            />
            <Text className={classes.logoText}>Mantine</Text>
          </Group>
          <Group gap="lg">
            <Button
              radius={"md"}
              variant="default"
              onClick={() => navigate("/login")}
            >
              Log in
            </Button>
            <Button
              radius={"md"}
              onClick={() => navigate("/login?register=true")}
            >
              Sign up
            </Button>
          </Group>
        </div>

        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              A{" "}
              <Text component="span" className={classes.highlight} inherit>
                fully featured
              </Text>{" "}
              React components library
            </Title>

            <Text className={classes.description} mt={30}>
              Build fully functional accessible web applications with ease –
              Mantine includes more than 100 customizable components and hooks
              to cover you in any situation
            </Text>

            <Group mt={40}>
              <Button
                radius={"md"}
                size="lg"
                onClick={() => navigate("/login")}
              >
                Get started
              </Button>
            </Group>
          </div>
          <div className={classes.image}>
            <img
              src="https://ui.mantine.dev/_next/static/media/image.9a65bd94.svg"
              alt="Mantine hero"
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
