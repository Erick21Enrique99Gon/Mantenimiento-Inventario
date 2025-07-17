import React from 'react';
import { Grid } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import BaseCard from '../../components/base-card/BaseCard';
import PageContainer from '../../components/container/PageContainer';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'


const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Date Time',
  },
];

const ExDateTime = () => {
  const [value, setValue] = React.useState(new Date());
  const [value2, setValue2] = React.useState(new Date());
  return (
    <PageContainer title="Date Time" description="this is Date Time page">
      {/* breadcrumb */}
      <Breadcrumb title="Date Picker" items={BCrumb} />


      {/* end breadcrumb */}
      <Grid container spacing={0}>
        {/* ------------------------- row 1 ------------------------- */}
        <Grid item xs={12} lg={6} sm={6} display="flex" alignItems="stretch">
          <BaseCard title="Basic Date picker">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* <MobileDateTimePicker defaultValue={dayjs('2022-04-17T15:30')} /> */}
              <MobileDateTimePicker
                  placeholder="Start date"
                  onChange={() => { }}
                  renderInput={(inputProps) => (
                    <CustomTextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      inputProps={{ 'aria-label': 'basic date picker' }}
                      {...inputProps}
                    />
                  )}
                  value={new Date()}
                />
            </LocalizationProvider>
          </BaseCard>
        </Grid>
        {/* ------------------------- row 1 ------------------------- */}
        <Grid item xs={12} lg={6} sm={6} display="flex" alignItems="stretch">
          <BaseCard title="Different Design for Date picker">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* <DesktopDateTimePicker defaultValue={dayjs('2022-04-17T15:30')} /> */}
              <DateTimePicker
                  renderInput={(props) => <CustomTextField {...props} fullWidth size="small" sx={{
                    '& .MuiSvgIcon-root': {
                      width: '18px',
                      height: '18px',
                    },
                    '& .MuiFormHelperText-root': {
                      display: 'none',
                    },
                  }} />}
                  placeholder="DateTimePicker"
                  value={value}
                  onChange={(newValue) => {
                    setValue(newValue);
                  }}
                />
            </LocalizationProvider>
          </BaseCard>
        </Grid>
        {/* ------------------------- row 1 ------------------------- */}
        <Grid item xs={12} lg={6} sm={6} display="flex" alignItems="stretch">
          <BaseCard title="Time picker">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* <TimePicker label="Basic time picker" />
               */}

<TimePicker
                  value={value2}
                  onChange={(newValue) => {
                    setValue2(newValue);
                  }}
                  renderInput={(params) => (
                    <CustomTextField
                      size="small"
                      {...params}
                      fullWidth
                      sx={{
                        '& .MuiSvgIcon-root': {
                          width: '18px',
                          height: '18px',
                        },
                        '& .MuiFormHelperText-root': {
                          display: 'none',
                        },
                      }}
                    />
                  )}
                />  
            </LocalizationProvider>
          </BaseCard>
        </Grid>
      </Grid>


    </PageContainer>
  );
};

export default ExDateTime;
