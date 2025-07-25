export function getCampaignSuccessScoreClassName(score: number) {
    if (score >= 80) {
        return 'text-success'
    } else if (score >= 40) {
        return 'text-warning'
    } else {
        return 'text-danger'
    }
}