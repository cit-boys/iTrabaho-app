import { AutoComplete, Button, Card, Input, Text } from '@geist-ui/react'
import React, { ReactElement, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Grid, FormField, Flex, TextField } from '@/components'
import SectionTitle from './SectionTitle'
import { allOptions, FormFields, required } from './helpers'
import { FieldLabel, Small, Span } from '../FormField'

export default function Experience(): ReactElement {
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useFormContext<FormFields>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience',
  })

  const [options, setOptions] =
    useState<Array<{ label: string; value: string }>>()

  const searchHandler = (currentValue: string) => {
    const createOptions = [
      {
        value: currentValue,
        label: 'Add "' + currentValue + '"',
      },
    ]
    if (!currentValue) return setOptions([])
    const relatedOptions = allOptions.filter((item) =>
      item?.value.toLowerCase().includes(currentValue)
    )
    const optionsWithCreatable =
      relatedOptions.length !== 0 ? relatedOptions : createOptions
    setOptions(optionsWithCreatable)
  }

  return (
    <section>
      <SectionTitle h1>Employment History</SectionTitle>
      <Flex direction="column" gap="2">
        {fields.map((field, index) => (
          <Card hoverable key={index}>
            <Flex justify="between">
              <Text h4 style={{ marginTop: 0 }}>
                Experience {index + 1}
              </Text>
              {fields.length === 1 && index === 0 ? null : (
                <Button auto scale={1 / 2} onClick={() => remove(index)}>
                  Remove
                </Button>
              )}
            </Flex>
            <Grid gapY="4" gapX="4" columns="2">
              <FormField
                title="Role"
                error={errors.experience?.[index]?.role?.message}
                requirementLabel="required"
              >
                <AutoComplete
                  clearable
                  disableFreeSolo
                  placeholder="Electrician"
                  options={options}
                  onSearch={searchHandler}
                  type={
                    errors.experience?.[index]?.role?.message
                      ? 'error'
                      : 'default'
                  }
                  {...register(`experience.${index}.role` as const, required)}
                  onChange={(value) =>
                    setValue(`experience.${index}.role`, value)
                  }
                />
              </FormField>
              <FormField title="Company" requirementLabel="optional">
                <Input
                  placeholder="Company A"
                  clearable
                  {...register(`experience.${index}.company`)}
                />
              </FormField>
              <FormField
                title="Start Date"
                requirementLabel="required"
                error={errors.experience?.[index]?.startDate?.message}
              >
                <TextField
                  status={
                    errors.experience?.[index]?.startDate?.message
                      ? 'error'
                      : undefined
                  }
                  type="month"
                  {...register(`experience.${index}.startDate`, required)}
                />
              </FormField>
              <FormField
                title="End Date"
                requirementLabel="required"
                error={errors.experience?.[index]?.endDate?.message}
              >
                <TextField
                  status={
                    errors.experience?.[index]?.endDate?.message
                      ? 'error'
                      : undefined
                  }
                  type="month"
                  {...register(`experience.${index}.endDate`, required)}
                />
              </FormField>
              <FormField title="Location" requirementLabel="optional">
                <Input
                  placeholder="Cebu City, Cebu"
                  clearable
                  {...register(`experience.${index}.location`)}
                />
              </FormField>
            </Grid>
            <ExperienceDetails experienceIndex={index} />
          </Card>
        ))}
        <Button
          onClick={() => append({ details: [{ description: '' }] })}
          style={{ width: 'fit-content' }}
        >
          Add Employment
        </Button>
      </Flex>
    </section>
  )
}

function ExperienceDetails({ experienceIndex }: { experienceIndex: number }) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<FormFields>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: `experience.${experienceIndex}.details`,
  })

  return (
    <>
      <FieldLabel as="div" direction="column" gap="2" css={{ mt: '$4' }}>
        <Span>Key Description/Impact</Span>
        {fields.map((field, index) => {
          const error =
            errors.experience?.[experienceIndex]?.details?.[index]?.description
              ?.message
          return (
            <div key={index}>
              <Flex gap="2" align="center">
                <TextField
                  status={error ? 'error' : undefined}
                  {...register(
                    `experience.${experienceIndex}.details.${index}.description` as const,
                    required
                  )}
                />
                {fields.length === 1 && index === 0 ? null : (
                  <Button auto scale={1 / 2} onClick={() => remove(index)}>
                    Remove
                  </Button>
                )}
              </Flex>
              {error ? <Small error>{error}</Small> : null}
            </div>
          )
        })}
      </FieldLabel>
      <Button auto mt="0.5rem" onClick={() => append({})}>
        Add Description
      </Button>
    </>
  )
}
