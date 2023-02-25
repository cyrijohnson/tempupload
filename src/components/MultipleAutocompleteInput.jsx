import * as React from "react";
import PropTypes from "prop-types";
import { useAutocomplete } from "@mui/base/AutocompleteUnstyled";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";

const Root = styled("div")(
  ({ theme }) => `
  color: ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,.85)"
  };
  font-size: 14px;
`
);

const Label = styled("label")`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

const InputWrapper = styled("div")(
  ({ theme }) => `
  width: 100%;
  border: 1px solid ${theme.palette.mode === "dark" ? "#434343" : "#d9d9d9"};
  background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;

  &:hover {
    border-color: ${theme.palette.mode === "dark" ? "#177ddc" : "#40a9ff"};
  }

  &.focused {
    border-color: ${theme.palette.mode === "dark" ? "#177ddc" : "#40a9ff"};
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
    color: ${
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.65)"
        : "rgba(0,0,0,.85)"
    };
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`
);

function Tag(props) {
  const { label, onDelete, ...other } = props;
  return (
    <div {...other}>
      <span>{label}</span>
      <CloseIcon onClick={onDelete} />
    </div>
  );
}

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const StyledTag = styled(Tag)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;
  line-height: 22px;
  background-color: ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "#fafafa"
  };
  border: 1px solid ${theme.palette.mode === "dark" ? "#303030" : "#e8e8e8"};
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: ${theme.palette.mode === "dark" ? "#177ddc" : "#40a9ff"};
    background-color: ${theme.palette.mode === "dark" ? "#003b57" : "#e6f7ff"};
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`
);

const Listbox = styled("ul")(
  ({ theme }) => `
  width: 300px;
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected='true'] {
    background-color: ${theme.palette.mode === "dark" ? "#2b2b2b" : "#fafafa"};
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li[data-focus='true'] {
    background-color: ${theme.palette.mode === "dark" ? "#003b57" : "#e6f7ff"};
    cursor: pointer;

    & svg {
      color: currentColor;
    }
  }
`
);

export default function MultipleAutocompleteInput(props) {
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: "customized-hook-demo",
    defaultValue: [],
    multiple: true,
    options: props.options ?? top100Films,
    getOptionLabel: (option) => option.name,
  });

  return (
    <Root>
      <div {...getRootProps()}>
        <Label {...getInputLabelProps()}>
          {props.label ?? "Multiple Autocomplete Input"}
        </Label>
        <InputWrapper ref={setAnchorEl} className={focused ? "focused" : ""}>
          {value.map((option, index) => (
            <StyledTag label={option.name} {...getTagProps({ index })} />
          ))}

          <input {...getInputProps()} />
        </InputWrapper>
      </div>
      {groupedOptions.length > 0 ? (
        <Listbox {...getListboxProps()}>
          {groupedOptions.map((option, index) => (
            <li {...getOptionProps({ option, index })}>
              <span>{option.name}</span>
              <CheckIcon fontSize="small" />
            </li>
          ))}
        </Listbox>
      ) : null}
    </Root>
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { name: "The Shawshank Redemption", year: 1994 },
  { name: "The Godfather", year: 1972 },
  { name: "The Godfather: Part II", year: 1974 },
  { name: "The Dark Knight", year: 2008 },
  { name: "12 Angry Men", year: 1957 },
  { name: "Schindler's List", year: 1993 },
  { name: "Pulp Fiction", year: 1994 },
  {
    name: "The Lord of the Rings: The Return of the King",
    year: 2003,
  },
  { name: "The Good, the Bad and the Ugly", year: 1966 },
  { name: "Fight Club", year: 1999 },
  {
    name: "The Lord of the Rings: The Fellowship of the Ring",
    year: 2001,
  },
  {
    name: "Star Wars: Episode V - The Empire Strikes Back",
    year: 1980,
  },
  { name: "Forrest Gump", year: 1994 },
  { name: "Inception", year: 2010 },
  {
    name: "The Lord of the Rings: The Two Towers",
    year: 2002,
  },
  { name: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { name: "Goodfellas", year: 1990 },
  { name: "The Matrix", year: 1999 },
  { name: "Seven Samurai", year: 1954 },
  {
    name: "Star Wars: Episode IV - A New Hope",
    year: 1977,
  },
  { name: "City of God", year: 2002 },
  { name: "Se7en", year: 1995 },
  { name: "The Silence of the Lambs", year: 1991 },
  { name: "It's a Wonderful Life", year: 1946 },
  { name: "Life Is Beautiful", year: 1997 },
  { name: "The Usual Suspects", year: 1995 },
  { name: "Léon: The Professional", year: 1994 },
  { name: "Spirited Away", year: 2001 },
  { name: "Saving Private Ryan", year: 1998 },
  { name: "Once Upon a Time in the West", year: 1968 },
  { name: "American History X", year: 1998 },
  { name: "Interstellar", year: 2014 },
  { name: "Casablanca", year: 1942 },
  { name: "City Lights", year: 1931 },
  { name: "Psycho", year: 1960 },
  { name: "The Green Mile", year: 1999 },
  { name: "The Intouchables", year: 2011 },
  { name: "Modern Times", year: 1936 },
  { name: "Raiders of the Lost Ark", year: 1981 },
  { name: "Rear Window", year: 1954 },
  { name: "The Pianist", year: 2002 },
  { name: "The Departed", year: 2006 },
  { name: "Terminator 2: Judgment Day", year: 1991 },
  { name: "Back to the Future", year: 1985 },
  { name: "Whiplash", year: 2014 },
  { name: "Gladiator", year: 2000 },
  { name: "Memento", year: 2000 },
  { name: "The Prestige", year: 2006 },
  { name: "The Lion King", year: 1994 },
  { name: "Apocalypse Now", year: 1979 },
  { name: "Alien", year: 1979 },
  { name: "Sunset Boulevard", year: 1950 },
  {
    name: "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
    year: 1964,
  },
  { name: "The Great Dictator", year: 1940 },
  { name: "Cinema Paradiso", year: 1988 },
  { name: "The Lives of Others", year: 2006 },
  { name: "Grave of the Fireflies", year: 1988 },
  { name: "Paths of Glory", year: 1957 },
  { name: "Django Unchained", year: 2012 },
  { name: "The Shining", year: 1980 },
  { name: "WALL·E", year: 2008 },
  { name: "American Beauty", year: 1999 },
  { name: "The Dark Knight Rises", year: 2012 },
  { name: "Princess Mononoke", year: 1997 },
  { name: "Aliens", year: 1986 },
  { name: "Oldboy", year: 2003 },
  { name: "Once Upon a Time in America", year: 1984 },
  { name: "Witness for the Prosecution", year: 1957 },
  { name: "Das Boot", year: 1981 },
  { name: "Citizen Kane", year: 1941 },
  { name: "North by Northwest", year: 1959 },
  { name: "Vertigo", year: 1958 },
  {
    name: "Star Wars: Episode VI - Return of the Jedi",
    year: 1983,
  },
  { name: "Reservoir Dogs", year: 1992 },
  { name: "Braveheart", year: 1995 },
  { name: "M", year: 1931 },
  { name: "Requiem for a Dream", year: 2000 },
  { name: "Amélie", year: 2001 },
  { name: "A Clockwork Orange", year: 1971 },
  { name: "Like Stars on Earth", year: 2007 },
  { name: "Taxi Driver", year: 1976 },
  { name: "Lawrence of Arabia", year: 1962 },
  { name: "Double Indemnity", year: 1944 },
  {
    name: "Eternal Sunshine of the Spotless Mind",
    year: 2004,
  },
  { name: "Amadeus", year: 1984 },
  { name: "To Kill a Mockingbird", year: 1962 },
  { name: "Toy Story 3", year: 2010 },
  { name: "Logan", year: 2017 },
  { name: "Full Metal Jacket", year: 1987 },
  { name: "Dangal", year: 2016 },
  { name: "The Sting", year: 1973 },
  { name: "2001: A Space Odyssey", year: 1968 },
  { name: "Singin' in the Rain", year: 1952 },
  { name: "Toy Story", year: 1995 },
  { name: "Bicycle Thieves", year: 1948 },
  { name: "The Kid", year: 1921 },
  { name: "Inglourious Basterds", year: 2009 },
  { name: "Snatch", year: 2000 },
  { name: "3 Idiots", year: 2009 },
  { name: "Monty Python and the Holy Grail", year: 1975 },
];
