import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';

const StatCard = ({ title, value, icon, color = 'primary.main', trend }) => {
  return (
    <Card className="hover-lift" sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="textSecondary" fontWeight="bold" sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" color="textPrimary">
              {value}
            </Typography>
            {trend && (
              <Typography variant="caption" color={trend.isPositive ? 'success.main' : 'error.main'} sx={{ mt: 1, display: 'block' }}>
                {trend.isPositive ? '↑' : '↓'} {trend.value} since last month
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}15`, color: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
