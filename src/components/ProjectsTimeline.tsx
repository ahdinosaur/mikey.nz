// TODO
//
// - Need to compute earliest start of project
// - Algorithm to pack projects:
//   - First sort projects by start date
//   - For next project, find available slot
//     - A slot is available if the current project ends before the next project starts
//     - A slot is empty is undefined or null
//  - Placements
//    - Container is position="relative"
//    - Is it possible to place using position="absolute" and have a top value?
//    - Make-up a distance per day, based on base font-size.
//  - Should we pre-compute this data in a server component?
