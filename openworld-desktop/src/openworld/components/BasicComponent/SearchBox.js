import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import './componentstyles.scss'

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const projects = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  { title: 'The Lord of the Rings: The Return of the King', year: 2003 }
];
const lessons = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  { title: 'The Lord of the Rings: The Return of the King', year: 2003 }
];
const useAutoCompleteStyles = makeStyles(theme => ({
  inputRoot: {
    color: "white",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "green"
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "red"
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "white"
    }
  }
}));

export function DropdownComboBox() {
  const classes = useAutoCompleteStyles();
  return (
    <div>
      <Autocomplete
        id="combo-box-demo"
        options={lessons}
        classes={classes}
        getOptionLabel={(option) => option.title}
        renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
        popupIcon={<ArrowDropDownIcon></ArrowDropDownIcon>}
      />
    </div>
  );
}

export function SearchComboBox() {
  const classes = useAutoCompleteStyles();
  return (
    <Autocomplete
      id="combo-box-demo"
      options={projects}
      getOptionLabel={option => option.title}
      renderInput={params => {
        return (
          <TextField
            {...params}
            label="Combo box"
            variant="outlined"
            fullWidth
          />
        );
      }}
      popupIcon={<SearchIcon style={{ color: "white" }}></SearchIcon>}
    />
  );
}

