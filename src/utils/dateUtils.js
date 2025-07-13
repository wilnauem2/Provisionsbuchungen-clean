// Format a date string to a human-readable format
export function formatLastSettlement(dateString) {
  if (!dateString) return 'Keine Abrechnung';
  
  const options = { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Ungültiges Datum';
  }
}

// Calculate days between a given date and today
export function calculateDaysOverdue(dateString) {
  if (!dateString) return 0;
  
  try {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const givenDate = new Date(dateString);
    const today = new Date();
    
    // Reset time part to compare only dates
    givenDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffDays = Math.round(Math.abs((today - givenDate) / oneDay));
    return diffDays;
  } catch (error) {
    console.error('Error calculating days overdue:', error);
    return 0;
  }
}

// Check if a date is overdue (more than 30 days)
export function isOverdue(insurer) {
  if (!insurer?.last_invoice) return true; // Consider overdue if no date is set
  
  const daysOverdue = calculateDaysOverdue(insurer.last_invoice);
  const daysThreshold = insurer.turnus === 'monatlich' ? 30 : 90;
  
  return daysOverdue > daysThreshold;
}
