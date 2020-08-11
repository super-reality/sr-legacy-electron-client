import React from "react"
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import NestedList from '../BasicComponent/NestedList'
import ReplyIcon from '../BasicComponent/ReplyIcon'
import {DropdownComboBox , SearchComboBox} from '../BasicComponent/SearchBox'

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
          <ReplyIcon></ReplyIcon>
        </Grid>
        <Grid item xs={6}>
          <SearchComboBox ></SearchComboBox>
        </Grid>
        <Grid item xs={5}>
          <DropdownComboBox ></DropdownComboBox>
        </Grid>
        <Grid item xs={12}>
          <NestedList ></NestedList>
        </Grid>
      </Grid>
    </div>
  );
}

