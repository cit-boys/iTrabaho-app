import { Component } from 'react'
import { Flex, Form, FormField, Grid, TextField } from '@/components'
import { UseControllerReturn, UseFormReturn } from 'react-hook-form'
import { FormFields, required } from './helpers'
import { Button, Input, Radio, Select } from '@geist-ui/react'
import SectionTitle from './SectionTitle'
import Experience from './Experience'

type State = FormFields

interface Props {
  methods: UseFormReturn<FormFields>
  sexController: UseControllerReturn<FormFields, 'sex'>
  educationController: UseControllerReturn<
    FormFields,
    'highestEducationAttained'
  >
}

export default class ApplicantFormView extends Component<Props, State> {
  state: State = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    sex: undefined,
    birthdate: '',

    yearsOfExperience: 0,
    highestEducationAttained: '',

    experience: [
      {
        role: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',

        details: [
          {
            description: '',
          },
        ],
      },
    ],
  }

  getFirstName() {
    return this.state.firstName
  }
  getLastName() {
    return this.state.lastName
  }
  getPhoneNumber() {
    return this.state.phoneNumber
  }
  getSex() {
    return this.state.sex
  }
  getBirthdate() {
    return this.state.birthdate
  }
  getYearsOfExperience() {
    return this.state.yearsOfExperience
  }
  getHighestEducationAttained() {
    return this.state.highestEducationAttained
  }
  getExperience() {
    return this.state.experience
  }

  validateForm() {
    const validations = [
      Boolean(this.getFirstName()),
      Boolean(this.getLastName()),
      Boolean(this.getPhoneNumber()),
      this.getSex() !== undefined,
      Boolean(this.getBirthdate()),
      this.getYearsOfExperience(),
      Boolean(this.getHighestEducationAttained()),
      this.getExperience().length,
    ]

    return validations.some((valid) => !valid)
  }

  sendApplicantCreateRequest(values: FormFields) {
    const { experience } = values

    // parse endDate and startDate to startMonth and StartYear for each experience
    const parsedExperience = experience.map((exp) => {
      const { startDate: start, endDate: end } = exp
      const startDate = new Date(start)
      const endDate = new Date(end)
      const startMonth = startDate.getMonth() + 1
      const endMonth = endDate.getMonth() + 1
      const startYear = startDate.getFullYear()
      const endYear = endDate.getFullYear()

      return { ...exp, startMonth, startYear, endMonth, endYear }
    })

    const body: typeof values = {
      ...values,
      experience: parsedExperience,
      phoneNumber: values.phoneNumber.replaceAll(' ', ''),
    }

    alert(JSON.stringify(body, null, 2))
  }

  render() {
    return (
      <Form
        noValidate
        action="POST"
        onSubmit={this.props.methods.handleSubmit(
          this.sendApplicantCreateRequest
        )}
      >
        <SectionTitle h1 hasMarginTop>
          Personal Details
        </SectionTitle>
        <Grid gapY="4">
          <Flex gap="4">
            <FormField
              title="First Name"
              error={this.props.methods.formState.errors.firstName?.message}
            >
              <Input
                placeholder="John"
                type={
                  this.props.methods.formState.errors.firstName?.message
                    ? 'error'
                    : 'default'
                }
                clearable
                {...this.props.methods.register('firstName', required)}
              />
            </FormField>
            <FormField
              title="Last Name"
              error={this.props.methods.formState.errors.lastName?.message}
            >
              <Input
                placeholder="Doe"
                type={
                  this.props.methods.formState.errors.lastName?.message
                    ? 'error'
                    : 'default'
                }
                clearable
                {...this.props.methods.register('lastName', required)}
              />
            </FormField>
          </Flex>
          <Grid flow="column" gap="4" css={{ gridTemplateColumns: '70% auto' }}>
            <FormField
              title="Phone Number"
              error={this.props.methods.formState.errors.phoneNumber?.message}
            >
              <Input
                label="+639"
                placeholder="922 283 3416"
                clearable
                type={
                  this.props.methods.formState.errors.phoneNumber?.message
                    ? 'error'
                    : 'default'
                }
                {...this.props.methods.register('phoneNumber', {
                  ...required,
                  minLength: {
                    message: 'Please fill in a valid Phone Number',
                    value: 10,
                  },
                  maxLength: {
                    message: 'Please fill in a valid Phone Number',
                    value: 12,
                  },
                })}
              />
            </FormField>

            <FormField
              title="Sex"
              error={this.props.methods.formState.errors.sex?.message}
            >
              <Radio.Group
                value={this.props.sexController.field.value}
                onChange={this.props.sexController.field.onChange}
              >
                <Radio value="M">Male</Radio>
                <Radio value="F">Female</Radio>
              </Radio.Group>
            </FormField>
          </Grid>

          <Grid>
            <FormField
              title="Birthdate"
              error={this.props.methods.formState.errors.birthdate?.message}
            >
              <TextField
                type="date"
                status={
                  this.props.methods.formState.errors.birthdate?.message
                    ? 'error'
                    : undefined
                }
                {...this.props.methods.register('birthdate', {
                  ...required,
                  validate: (v) => {
                    if (isNaN(Date.parse(v))) return 'Please fill in this field'
                    return undefined
                  },
                  valueAsDate: true,
                })}
              />
            </FormField>
          </Grid>
        </Grid>

        <SectionTitle h1>Work</SectionTitle>
        <Grid gapX="4" css={{ gridTemplateColumns: '70% auto' }}>
          <FormField
            title="Highest Education Attained"
            error={
              this.props.methods.formState.errors.highestEducationAttained
                ?.message
            }
            requirementLabel="optional"
          >
            <Select
              placeholder="Choose one"
              type={
                this.props.methods.formState.errors.highestEducationAttained
                  ?.message
                  ? 'error'
                  : 'default'
              }
              value={this.props.educationController.field.value}
              onChange={this.props.educationController.field.onChange}
            >
              <Select.Option value="primary">Primary</Select.Option>
              <Select.Option value="junior">Junior High School</Select.Option>
              <Select.Option value="senior">Senior High School</Select.Option>
              <Select.Option value="undergraduate">Undergraduate</Select.Option>
              <Select.Option value="graduate">Graduate</Select.Option>
              <Select.Option value="doctoral">Doctorial</Select.Option>
            </Select>
          </FormField>
          <FormField
            title="Years of Experience"
            error={
              this.props.methods.formState.errors.yearsOfExperience?.message
            }
          >
            <Input
              type={
                this.props.methods.formState.errors.yearsOfExperience?.message
                  ? 'error'
                  : 'default'
              }
              htmlType="number"
              min={0}
              {...this.props.methods.register('yearsOfExperience', {
                ...required,
                valueAsNumber: true,
              })}
            />
          </FormField>
        </Grid>

        <Experience />

        <Button
          type="secondary"
          htmlType="submit"
          style={{ marginTop: '2rem' }}
        >
          Create
        </Button>
      </Form>
    )
  }
}
