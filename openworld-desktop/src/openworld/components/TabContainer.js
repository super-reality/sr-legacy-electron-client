import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import HomeTab from './Tabs/HomeTab'
import ScoreTab from './Tabs/ScoreTab'
import TeachTab from './Tabs/TeachTab'
import XRTab from './Tabs/XRTab'
import LearnTab from './Tabs/LearnTab';
import { SvgIcon, Container } from '@material-ui/core';

const AntTabs = withStyles({
  root: {
    borderBottom: '1px solid #e8e8e8',
  },
  indicator: {
    backgroundColor: '#1890ff',
  },
})(Tabs);

const AntTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: '#40a9ff',
      opacity: 1,
    },
    '&$selected': {
      color: '#1890ff',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#40a9ff',
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      maxWidth: 40,
      width: '100%',
      backgroundColor: '#635ee7',
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: '#fff',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    '&:focus': {
      opacity: 1,
    },
  },
}))((props) => <Tab disableRipple {...props} />);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    color:"white"
  },
  padding: {
    padding: theme.spacing(3),
  },
  demo2: {
    backgroundColor: '#2e1534',
  },
  tab: {
    minWidth:30,
    width:"20%"
  }
}));


function SubTab(value) {
  if (value == 0) {
    var tab = <HomeTab></HomeTab>
  }
  else if (value == 1) {
    var tab = <LearnTab></LearnTab>
  }
  else if (value == 2) {
    var tab = <ScoreTab></ScoreTab>
  }
  else if (value == 3) {
    var tab = <TeachTab></TeachTab>
  }
  else if (value == 4) {
    var tab = <XRTab></XRTab>
  }
  return tab
}
function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}
export default function MainTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <div className={classes.demo2}>
        <StyledTabs value={value}  onChange={handleChange} aria-label="styled tabs example">
          <StyledTab label={<HomeIcon></HomeIcon>}>
          </StyledTab>
          <StyledTab label="Learn" className={classes.tab}/>
          <StyledTab label="Teach" className={classes.tab}/>
          <StyledTab label="XR" className={classes.tab}/>
          <StyledTab label="Score" className={classes.tab}/>
        </StyledTabs>
        <div className={classes.padding}>
          {SubTab(value)}
        </div>
      </div>
    </div>
  );
}
