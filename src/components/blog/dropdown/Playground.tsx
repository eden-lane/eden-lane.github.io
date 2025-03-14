import { useRef, useState } from "react";
import { Dropdown } from "./Dropdown";
import { type MenuConfig, Menu as MenuBase } from "./Menu";
import { styled } from "styled-components";
import EditIcon from "./icons/edit.svg";
import InboxIcon from "./icons/inbox.svg";
import CheckIcon from "./icons/check.svg";
import PlusIcon from "./icons/plus.svg";
import TagIcon from "./icons/tag.svg";
import DeleteIcon from "./icons/delete.svg";
import SearchIcon from "./icons/search.svg";
import MaximizeIcon from "../common/icons/maximize.svg";
import MinimizeIcon from "../common/icons/minimize.svg";
import VerifiedIcon from "./icons/verified.svg";
import SettingsIcon from "./icons/settings.svg";
import ChangelogIcon from "./icons/changelog.svg";
import HotkeysIcon from "./icons/hotkeys.svg";
import ColorIcon from "./icons/color.svg";
import SunIcon from "./icons/sun.svg";
import MoonIcon from "./icons/moon.svg";
import HelpIcon from "./icons/help.svg";
import ExitIcon from "./icons/exit.svg";
import edenPic from "./eden.jpg";

const MenuExample = () => {
  const [projectsInput, setProjectsInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>("Work");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const projectsInputRef = useRef<HTMLInputElement>(null);

  const projects = [
    "Personal",
    "Work",
    "Home",
    "My project",
    "Kona",
    "DEV",
    "YouTube",
    "Reading",
  ];
  const tags = ["5min", "phone", "PR review"];

  const config: MenuConfig = {
    items: [
      {
        render: () => {
          return (
            <>
              <MenuBase.Icon>
                <Icon icon={EditIcon} />
              </MenuBase.Icon>
              <MenuBase.Title>Edit...</MenuBase.Title>
            </>
          );
        },
      },
      {
        selectable: false,
        render: () => {
          return <MenuBase.Delimiter />;
        },
      },
      {
        render: () => (
          <>
            <MenuBase.Icon>
              <Icon icon={InboxIcon} />
            </MenuBase.Icon>
            <MenuBase.Title>
              <>Project</>
            </MenuBase.Title>
          </>
        ),
        config: {
          header: () => (
            <Search>
              <Icon icon={SearchIcon} />
              <Input
                ref={projectsInputRef}
                value={projectsInput}
                onChange={(e) => setProjectsInput(e.target.value)}
                placeholder="Filter projects..."
              />
            </Search>
          ),
          items: [
            ...projects
              .filter((item) => item.includes(projectsInput))
              .map((item) => ({
                render: () => (
                  <>
                    <MenuBase.Icon>
                      {selectedProject === item ? (
                        <Icon icon={CheckIcon} />
                      ) : null}
                    </MenuBase.Icon>
                    <MenuBase.Title>{item}</MenuBase.Title>
                  </>
                ),
                onSelect: () => setSelectedProject(item),
              })),
            {
              render: () => <MenuBase.Delimiter />,
              selectable: false,
            },
            {
              render: () => (
                <>
                  <MenuBase.Icon>
                    <Icon icon={PlusIcon} />
                  </MenuBase.Icon>
                  <MenuBase.Title>Add project...</MenuBase.Title>
                </>
              ),
            },
          ],
        },
      },
      {
        render: () => (
          <>
            <MenuBase.Icon>
              <Icon icon={TagIcon} />
            </MenuBase.Icon>
            <MenuBase.Title>
              <>Tags</>
            </MenuBase.Title>
          </>
        ),
        config: {
          header: () => (
            <Search>
              <Icon icon={SearchIcon} />
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Filter tags..."
              />
            </Search>
          ),
          items: [
            ...tags
              .filter((t) => t.includes(tagsInput))
              .map((t) => ({
                render: () => (
                  <>
                    <MenuBase.Title>{t}</MenuBase.Title>
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(t)}
                      onChange={() => {}}
                    />
                  </>
                ),
                onSelect: () => {
                  if (selectedTags.includes(t)) {
                    setSelectedTags(selectedTags.filter((tag) => tag !== t));
                  } else {
                    setSelectedTags([...selectedTags, t]);
                  }
                },
              })),
            {
              render: () => <MenuBase.Delimiter />,
              selectable: false,
            },
            {
              render: () => (
                <>
                  <MenuBase.Icon>
                    <Icon icon={PlusIcon} />
                  </MenuBase.Icon>
                  <MenuBase.Title>Add tag...</MenuBase.Title>
                </>
              ),
            },
          ],
        },
      },
      {
        danger: true,
        render: () => (
          <Danger>
            <Icon icon={DeleteIcon} />
            <MenuBase.Title>Delete</MenuBase.Title>
          </Danger>
        ),
      },
    ],
  };

  return (
    <Dropdown
      config={config}
      children={({ ref, onClick }) => (
        <Button variant="transparent" ref={ref} onClick={onClick}>
          <Text>Nested menu</Text>
        </Button>
      )}
      Menu={Menu}
      MenuBody={MenuBody}
    />
  );
};

const MainMenuExample = () => {
  const [theme, setTheme] = useState("light");

  const config: MenuConfig = {
    items: [
      {
        render: () => (
          <Profile>
            <Avatar src={edenPic.src} alt="eden lane" />
            <Flex gap={2} vertical>
              <Text strong>eden lane</Text>
              <Premium>
                <Icon icon={VerifiedIcon} />
                <Text>Premium</Text>
              </Premium>
            </Flex>
          </Profile>
        ),
        selectable: false,
      },
      {
        render: () => <MenuBase.Delimiter />,
        selectable: false,
      },
      {
        render: () => (
          <>
            <MenuBase.Icon>
              <Icon icon={SettingsIcon} />
            </MenuBase.Icon>
            <MenuBase.Title>Settings</MenuBase.Title>
          </>
        ),
      },
      {
        render: () => (
          <>
            <MenuBase.Icon>
              <Icon icon={ChangelogIcon} />
            </MenuBase.Icon>
            <MenuBase.Title>Changelog</MenuBase.Title>
            <LabelNew>
              <Text>New</Text>
            </LabelNew>
          </>
        ),
      },
      {
        render: () => (
          <>
            <MenuBase.Icon>
              <Icon icon={HotkeysIcon} />
            </MenuBase.Icon>
            <MenuBase.Title>Hotkeys</MenuBase.Title>
          </>
        ),
      },
      {
        render: () => (
          <>
            <MenuBase.Icon>
              <Icon icon={ColorIcon} />
            </MenuBase.Icon>
            <MenuBase.Title>Theme</MenuBase.Title>
            <Group>
              <GroupButton
                $active={theme === "light"}
                onClick={(event) => {
                  event.stopPropagation();
                  setTheme("light");
                }}
              >
                <Icon icon={SunIcon} />
              </GroupButton>
              <GroupButton
                $active={theme === "dark"}
                onClick={(event) => {
                  event.stopPropagation();
                  setTheme("dark");
                }}
              >
                <Icon icon={MoonIcon} />
              </GroupButton>
            </Group>
          </>
        ),
      },
      {
        render: () => (
          <>
            <MenuBase.Icon>
              <Icon icon={HelpIcon} />
            </MenuBase.Icon>
            <MenuBase.Title>Help</MenuBase.Title>
            <MenuBase.Hotkey>?</MenuBase.Hotkey>
          </>
        ),
      },
      {
        render: () => <MenuBase.Delimiter />,
        selectable: false,
      },
      {
        render: () => (
          <>
            <MenuBase.Icon>
              <Icon icon={ExitIcon} />
            </MenuBase.Icon>
            <MenuBase.Title>Sign out</MenuBase.Title>
          </>
        ),
      },
      {
        render: () => <MenuBase.Delimiter />,
        selectable: false,
      },
      {
        render: () => (
          <Flex>
            <Version>Version 5.0.1</Version>
          </Flex>
        ),
        selectable: false,
      },
    ],
  };

  return (
    <Dropdown
      config={config}
      children={({ ref, onClick }) => (
        <Button variant="transparent" ref={ref} onClick={onClick}>
          <Text>Main menu</Text>
        </Button>
      )}
      Menu={Menu}
    />
  );
};

const examples = [
  {
    title: "Nested menu",
    example: <MenuExample />,
  },
  {
    title: "Main menu",
    example: <MainMenuExample />,
  },
];

const positions = ["top-left", "top-right", "bottom-left", "bottom-right"];

export const Playground = () => {
  const [maximized, setMaximized] = useState(false);
  const [example, setExample] = useState(examples[1]);
  const [position, setPosition] = useState(positions[0]);

  const examplesConfig: MenuConfig = {
    items: examples.map((item) => ({
      render: () => (
        <>
          <MenuBase.Icon>
            {item === example ? <Icon icon={CheckIcon} /> : null}
          </MenuBase.Icon>
          <MenuBase.Title>{item.title}</MenuBase.Title>
        </>
      ),
      onSelect: () => setExample(item),
    })),
  };

  const positionsConfig: MenuConfig = {
    items: positions.map((p) => ({
      render: () => (
        <>
          <MenuBase.Icon>
            {p === position ? <Icon icon={CheckIcon} /> : null}
          </MenuBase.Icon>
          <MenuBase.Title>{p}</MenuBase.Title>
        </>
      ),
      onSelect: () => setPosition(p),
    })),
  };

  return (
    <PlaygroundRoot maximized={maximized}>
      <PlaygroundHeader>
        <Flex alignItems="center" gap={4}>
          <Dropdown config={examplesConfig}>
            {({ onClick, ref }) => (
              <>
                <Text>Example:</Text>
                <Button ref={ref} onClick={onClick} variant="transparent">
                  <Text>{example.title}</Text>
                </Button>
              </>
            )}
          </Dropdown>
          <Text>·</Text>
          <Dropdown config={positionsConfig}>
            {({ onClick, ref }) => (
              <>
                <Text>Position:</Text>
                <Button ref={ref} onClick={onClick} variant="transparent">
                  <Text>{position}</Text>
                </Button>
              </>
            )}
          </Dropdown>
        </Flex>
        <ControlButton onClick={() => setMaximized(!maximized)}>
          <img
            width={16}
            height={16}
            src={!maximized ? MaximizeIcon.src : MinimizeIcon.src}
            alt="Maximize"
          />
        </ControlButton>
      </PlaygroundHeader>
      <PlaygroundBody position={position}>{example.example}</PlaygroundBody>
    </PlaygroundRoot>
  );
};

const Icon = (props: { icon: { src: string } }) => {
  return <img width={16} height={16} src={props.icon.src} alt="Icon" />;
};

const Menu = styled(MenuBase.Root)`
  min-width: 200px;
`;

const MenuBody = styled(MenuBase.Body)`
  max-height: 210px;
`;

type ButtonWrapperProps = {
  variant?: "primary" | "secondary" | "transparent";
};

export const Button = styled.button<ButtonWrapperProps>`
  display: flex;
  padding: 4px;
  align-items: center;
  justify-content: center;
  border: ${() => {
    return "none";
  }};
  border-radius: 4px;
  background-color: ${(p) => {
    if (p.variant === "primary") {
      return p.theme.primaryColor;
    }
    return "transparent";
  }};

  &:hover {
    background-color: ${(p) => {
      if (p.variant === "secondary") {
        return "rgba(0, 0, 0, 0.1)";
      }
      if (p.variant === "transparent") {
        return "rgba(0, 0, 0, 0.05)";
      }

      return "transparent";
    }};
  }
`;

const Text = styled.span<{ strong?: boolean }>`
  font-size: 12px;
  color: #555;
  font-weight: ${(p) => (p.strong ? 600 : "normal")};
`;

const Danger = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #c42626;
`;

const Input = styled.input`
  width: 100%;
  font-size: 12px;
  padding: 4px;
  border: none;
  outline: none;
`;

const PlaygroundRoot = styled.div<{ maximized: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  position: ${(p) => (p.maximized ? "fixed" : "relative")};
  inset: ${(p) => (p.maximized ? "0" : undefined)};
`;

const PlaygroundBody = styled.div<{ position: string }>`
  padding: 8px;
  display: flex;
  align-self: stretch;
  justify-self: stretch;
  min-height: 100px;
  height: 100%;
  justify-content: ${(p) => {
    if (p.position === "top-left") {
      return "flex-start";
    }
    if (p.position === "top-right") {
      return "flex-end";
    }
    if (p.position === "bottom-left") {
      return "flex-start";
    }
    if (p.position === "bottom-right") {
      return "flex-end";
    }
  }};
  align-items: ${(p) => {
    if (p.position === "top-left") {
      return "flex-start";
    }
    if (p.position === "top-right") {
      return "flex-start";
    }
    if (p.position === "bottom-left") {
      return "flex-end";
    }
    if (p.position === "bottom-right") {
      return "flex-end";
    }
  }};
`;

const PlaygroundHeader = styled.header`
  display: flex;
  align-items: center;
  align-self: stretch;
  justify-content: space-between;
  border-bottom: 1px dashed #eee;
  padding: 4px 8px;
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px 8px;
  border-bottom: 1px solid #eee;
  margin-bottom: 4px;
`;

const ControlButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: none;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const Group = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
  overflow: hidden;
`;

const Flex = styled.div<{
  gap?: number;
  alignItems?: string;
  vertical?: boolean;
}>`
  display: flex;
  align-items: ${(p) => p.alignItems};
  flex-direction: ${(p) => (p.vertical ? "column" : "row")};
  gap: ${(p) => p.gap || 0}px;
`;

const Profile = styled(Flex).attrs({ gap: 8 })`
  height: 40px;
`;

const Avatar = styled.img`
  border-radius: 50%;
  height: 40px;
  width: 40px;
`;

const Premium = styled(Flex).attrs({ gap: 4 })`
  color: #ee8953;
`;

const LabelNew = styled(Text)`
  font-size: 14px;
  background: #d4ffd4;
  color: #599919;
  border-radius: 4px;
  padding: 0 4px;
`;

const Version = styled(Text)`
  color: ${(p) => p.theme.mutedColor};
  font-size: 12px;
`;

const GroupButton = styled.div<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  background-color: ${(p) =>
    p.$active ? "rgba(0, 0, 0, 0.09)" : "transparent"};
  opacity: 0.6;

  &:hover {
    opacity: 1;
  }
`;
