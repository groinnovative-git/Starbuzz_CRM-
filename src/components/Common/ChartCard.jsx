import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const ChartCard = ({ title, children }) => {
  return (
    <Card className="hover-lift" sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" color="textPrimary" mb={3} fontWeight="bold">
          {title}
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
