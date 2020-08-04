import React from "react"
import ReplyIcon from '@material-ui/icons/Reply';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from '@material-ui/icons/Search';
import style from './HomeTab.module.css'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import NestedList from '../BasicComponent/NestedList'

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
function SearchProjectsComboBox() {
  const classes = useAutoCompleteStyles();
  return (
    <Autocomplete
      id="combo-box-demo"
      classes={classes}
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
function SearchLessonsComboBox() {
  const classes = useAutoCompleteStyles();
  return (
    <Autocomplete
      id="combo-box-demo"
      options={lessons}
      classes={classes}
      getOptionLabel={(option) => option.title}
      renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
      popupIcon={<ArrowDropDownIcon style={{ color: "white" }}></ArrowDropDownIcon>}
    />
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function HomeTab() {
  const classes = useStyles();
  return (
    <div>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={1}>
          <ReplyIcon style={{ color: "white"}}></ReplyIcon>
        </Grid>
        <Grid item xs={6}>
          <SearchProjectsComboBox ></SearchProjectsComboBox>
        </Grid>
        <Grid item xs={5}>
          <SearchLessonsComboBox ></SearchLessonsComboBox>
        </Grid>
        <Grid item xs={12}>
          <NestedList ></NestedList>
        </Grid>
      </Grid>
    </div>
  );
}

