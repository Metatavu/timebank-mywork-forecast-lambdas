export const filterByDate = (object: { start_date: string, end_date: string }, currentDate: Date, parameters: { startDate?: Date, endDate?: Date }): boolean => {
  if (object.start_date === null || object.end_date === null) {
    return false;
  }

  if (parameters.startDate) {
    if (parameters.startDate <= new Date(object.start_date)) {
      return false;
    }
  } else if (currentDate <= new Date(object.start_date)) {
    return false;
  }

  if (parameters.endDate) {
      if (parameters.endDate >= new Date(object.end_date)) {
        return false;
      }
  } else if (currentDate >= new Date(object.end_date)) {
    return false;
  }

  return true;
}

export const filterByProject = (object: { project?: number }, parameters: { projectId?: string }): boolean => {
  if (parameters.projectId !== null && object.project.toString() !== parameters.projectId) {
    return false;
  }

  return true;
}

export const filterByPerson = (object: { person?: number }, parameters: { personId?: string }): boolean => {
  if (parameters.personId !== null && object.person.toString() !== parameters.personId) {
    return false;
  }

  return true;
}