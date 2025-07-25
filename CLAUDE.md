# Code style
- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible (eg. import { foo } from 'bar')
- Use the LoaderCircleIcon Lucide icon for button loaders
- Use existing use-cases before using a repo for the same data
- Sanitise request body with a zod schema
- Check that any resource IDs passed to a controller are checked for ownership
- Use interfaces for all controller requests, results
- Use interfaces for all API request bodies, responses
- Use DTOs for all API responses

# Version control
- Leave changes unsaved, do not commit or add any changes to Git
